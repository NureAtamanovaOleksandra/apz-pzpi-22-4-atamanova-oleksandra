const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const OrderItem = require('../models/OrderItem');

const authenticateToken = require('../middlewares/authenticateToken');
const checkAdmin = require('../middlewares/checkAdmin');

router.get('/backup', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const data = {
            orders: await Order.find(),
            users: await User.find(),
            products: await Product.find(),
            payments: await Payment.find(),
            orderItems: await OrderItem.find(),
            timestamp: new Date().toISOString()
        };

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(__dirname, '../backups', `backup-${timestamp}.json`);
        
        fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
        
        res.json({ 
            message: 'Backup created successfully', 
            path: backupPath 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/export', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const data = {
            orders: await Order.find(),
            users: await User.find(),
            products: await Product.find()
        };

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const exportPath = path.join(__dirname, '../exports', `export-${timestamp}.json`);
        
        if (!fs.existsSync(path.join(__dirname, '../exports'))) {
            fs.mkdirSync(path.join(__dirname, '../exports'));
        }

        fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
        
        res.download(exportPath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/import', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const importData = req.body;

        if (!importData.orders && !importData.products && !importData.users) {
            return res.status(400).json({ message: 'No valid data provided for import' });
        }

        if (importData.orders) {
            await Order.insertMany(importData.orders);
        }
        if (importData.products) {
            await Product.insertMany(importData.products);
        }
        if (importData.users) {
            await User.insertMany(importData.users);
        }

        res.json({ 
            message: 'Data imported successfully',
            imported: {
                orders: importData.orders?.length || 0,
                products: importData.products?.length || 0,
                users: importData.users?.length || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/restore', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const { backupPath } = req.body;
        
        if (!fs.existsSync(backupPath)) {
            return res.status(404).json({ message: "Backup file not found" });
        }

        let backupData;
        try {
            const fileContent = fs.readFileSync(backupPath, 'utf8');
            backupData = JSON.parse(fileContent);
        } catch (error) {
            return res.status(400).json({ message: "Error reading backup file", error: error.message });
        }

        if (!backupData.orders || !backupData.users || !backupData.products) {
            return res.status(400).json({ message: "Invalid backup file structure" });
        }

        await Promise.all([
            Order.deleteMany({}),
            User.deleteMany({}),
            Product.deleteMany({}),
            Payment.deleteMany({}),
            OrderItem.deleteMany({})
        ]);

        await Promise.all([
            Order.insertMany(backupData.orders),
            User.insertMany(backupData.users),
            Product.insertMany(backupData.products),
            backupData.payments && Payment.insertMany(backupData.payments),
            backupData.orderItems && OrderItem.insertMany(backupData.orderItems)
        ]);

        res.json({ 
            message: 'Backup restored successfully',
            restoredData: {
                orders: backupData.orders.length,
                users: backupData.users.length,
                products: backupData.products.length,
                payments: backupData.payments?.length || 0,
                orderItems: backupData.orderItems?.length || 0
            }
        });
    } catch (error) {
        console.error('Restore error:', error);
        res.status(500).json({ 
            message: "Error restoring backup", 
            error: error.message,
            stack: error.stack 
        });
    }
});

module.exports = router;