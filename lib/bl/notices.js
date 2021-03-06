var dbConnect = require('../db/dbconnect')
var dbManip = require('../db/dbmanip')
var Notice = require('../models/Notice')

exports.getNoticeObjectId = (notice, callback) => {
    dbManip.queryId(notice, 'notices', callback)
}

exports.createNotice = (notice, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db()

        db.collection('notices').insertOne(notice, (err) => {

            dbL.close()

            if(err) {
                callback(false)
                return
            }
            callback(true)
        })
    })
}

exports.listNoticesBySchool = (school, callback) => {
    dbManip.queryId(school, 'schools', (schoolObjectId) => {
        dbConnect((err, dbL) => {
            var db  = dbL.db()

            db.collection('notices').find({school: schoolObjectId}).toArray((err, documents) => {

                dbL.close()

                if(err) {
                    callback(false)
                    return
                }
                callback(documents)
            })
        })
    })
}

exports.listNoticesByCourse = (course, callback) => {
    dbManip.queryId(course, 'courses', (courseObjectId) => {
        dbConnect((err, dbL) => {
            var db = dbL.db()

            db.collection('notices').find({course: courseObjectId}).toArray((err, documents) => {

                dbL.close()

                if(err) {
                    callback(false)
                    return
                }
                callback(documents)
            })
        })
    })
}