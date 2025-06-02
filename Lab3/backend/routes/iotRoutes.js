const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/status', async (req, res) => {
    try {
        const latestOrder = await Order.findOne()
            .sort({ createdAt: -1 })
            .select('status');
        
        if (!latestOrder) {
            return res.status(404).json({ status: "no_orders" });
        }

        res.json({ status: latestOrder.status });
    } catch (error) {
        console.error('IoT status error:', error);
        res.status(500).json({ status: "error" });
    }
});

router.get('/statistics', async (req, res) => {
    try {
        const orders = await Order.find({ 
            createdAt: { 
                $gte: new Date(Date.now() - 24*60*60*1000) 
            } 
        });

        let totalProcessingTime = 0;
        let completedOrders = 0;

        orders.forEach(order => {
            if (order.status === 'completed' || order.status === 'ready') {
                const processingTime = (order.updatedAt - order.createdAt) / 1000;
                totalProcessingTime += processingTime;
                completedOrders++;
            }
        });

        const averageProcessingTime = completedOrders > 0 
            ? totalProcessingTime / completedOrders 
            : 0;

        const successRate = (orders.length > 0)
            ? (completedOrders / orders.length) * 100
            : 0;

        res.json({
            totalOrders: orders.length,
            completedOrders: completedOrders,
            averageProcessingTime: averageProcessingTime,
            successRate: successRate,
            efficiency: (successRate > 80) ? "HIGH" : (successRate > 50 ? "MEDIUM" : "LOW")
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;