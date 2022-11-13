'use strict';

const db = require("../models")
const Response = require("../utils/response")

class MainController {

    constructor() {
        this.sequelize = db.sequelize
        this.store_area = db.store_area
    }

    getDataChart = async(req, res) => {
        try {
            // get query params
            let where = ''
            const areas = req.query.areas
            const dateFrom = req.query.date_from
            const dateTo = req.query.date_to

            // filter by area
            if (areas != null) {
                where += 'WHERE ('
                for (const area of areas.split(' ')) {
                    where += `SA.area_id = ${area} OR `
                }

                where = where.substring(0, where.length - 4)
                where += ')'
            }

            // filter by tanggal (range)
            if (dateFrom != null && dateTo != null) {
                where += ` AND RP.tanggal BETWEEN '${dateFrom}' AND '${dateTo}'`
            }

            // get data chart
            const data = await this.sequelize.query(
                `SELECT 
                    SA.area_id,
                    SA.area_name,
                    SUM(RP.compliance) AS "total_compliance",
                    COUNT(RP.report_id) AS "record_count",
                    (
                        SELECT SUM(RP.compliance) / COUNT(RP.report_id) * 100
                    ) AS "calculation_value"
                FROM report_product AS RP
                JOIN store AS S ON RP.store_id = S.store_id
                JOIN store_area AS SA ON S.area_id = SA.area_id
                ${where}
                GROUP BY SA.area_name
                ORDER BY SA.area_id ASC`, {
                raw: true,  
            })

            return Response.send(res, 200, data[0], 'Successfully get data chart!')
        } catch (err) {
            return Response.send(res, 500, null, "Internal Server Error", err.message)
        }
    }

    getDataTable = async(req, res) => {
        try {
            // variables
            let response = []
            let dataList = []
            let areaIdList = []
            
            // get query params
            const areas = req.query.areas
            const dateFrom = req.query.date_from
            const dateTo = req.query.date_to

            // filter and set valid area_id
            if (areas != null) {
                for (const area of areas.split(' ').sort((a, b) => a - b)) {
                    const checkArea = await this.store_area.findOne({ 
                        where: { area_id: area } 
                    })

                    // check only valid area_id
                    if (checkArea == null)
                        return Response.send(res, 400, null, 'Store area not found! please check your input query')
                    
                    // collect valid area_id
                    areaIdList.push(area)
                }
            } else {
                // get semua data area
                const storeAreas = await this.store_area.findAll()

                // collect area_id
                storeAreas.map(area => areaIdList.push(area.area_id))
            }

            // get data value calculation for each area
            for (const area of areaIdList) {
                // filter range tanggal
                if (dateFrom != null && dateTo != null) {
                    const data = await this.sequelize.query(
                        `SELECT 
                            PB.brand_name,
                            (
                                SELECT SUM(RP.compliance) / COUNT(RP.report_id) * 100
                            ) AS "calculation_value",
                            SA.area_id,
                            SA.area_name
                        FROM report_product AS RP
                        JOIN store AS S ON RP.store_id = S.store_id
                        JOIN store_area AS SA ON S.area_id = SA.area_id
                        JOIN product AS P ON RP.product_id = P.product_id
                        JOIN product_brand AS PB ON P.brand_id = PB.brand_id
                        WHERE SA.area_id = ${area}
                        AND RP.tanggal BETWEEN '${dateFrom}' AND '${dateTo}'
                        GROUP BY PB.brand_name`, {
                        raw: true,
                    })

                    for(const breakData of data[0]) {
                        dataList.push(breakData)
                    }
                } else {
                    const data = await this.sequelize.query(
                        `SELECT 
                            PB.brand_name,
                            (
                                SELECT SUM(RP.compliance) / COUNT(RP.report_id) * 100
                            ) AS "calculation_value",
                            SA.area_id,
                            SA.area_name
                        FROM report_product AS RP
                        JOIN store AS S ON RP.store_id = S.store_id
                        JOIN store_area AS SA ON S.area_id = SA.area_id
                        JOIN product AS P ON RP.product_id = P.product_id
                        JOIN product_brand AS PB ON P.brand_id = PB.brand_id
                        WHERE SA.area_id = ${area}
                        GROUP BY PB.brand_name`, {
                        raw: true,
                    })

                    for(const breakData of data[0]) {
                        dataList.push(breakData)
                    }
                }
            }

            // transform dataList
            // mapping data & group by brand_name
            let rotiTawar = {}
            let susuKaleng = {}
            for (const data of dataList) {
                if (data.brand_name == 'ROTI TAWAR') {
                    rotiTawar.brand_name = data.brand_name
                    rotiTawar[data.area_name.toLowerCase().split(' ').join('_')] = data.calculation_value
                } else if (data.brand_name == 'SUSU KALENG') {
                    susuKaleng.brand_name = data.brand_name
                    susuKaleng[data.area_name.toLowerCase().split(' ').join('_')] = data.calculation_value
                }
            }

            // set output response
            response.push(rotiTawar)
            response.push(susuKaleng)

            return Response.send(res, 200, response, 'Successfully get table data!')
        } catch (err) {
            return Response.send(res, 500, null, "Internal Server Error", err.message)
        }
    }

    getAreas = async(req, res) => {
        try {
            const storeAreas = await this.store_area.findAll()
            return Response.send(res, 200, storeAreas, 'Successfully get data store area!')
        } catch (err) {
            return Response.send(res, 500, null, "Internal Server Error", err.message)
        }
    }
}

module.exports = new MainController()