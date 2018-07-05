const userType = 'student'

var fs = require('fs')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var htmldynmodule = require('../../lib/htmldyn/htmldynmodule')

var blNotices = require('../../lib/bl/notices')
var blCourses = require('../../lib/bl/courses')

exports.filePath = ''

exports.servePage = (req, res, options) => {

    var filePath = exports.filePath

    auth.postAuth(req, res, (currentUser, currentUserType) => {

        if(userType !== currentUserType) {

            wrongUserType.servePage(req, res)

            return
        }

        var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

        values.username = currentUser.username
        values.usertype = userType
        values.pagetitle = "Notices"

        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        fs.readFile(__dirname + '/template.html', 'utf8', (err, templateHtml) => {
            fs.readFile(filePath, 'utf8', (err, viewHtml) => {
                values.content = viewHtml

                var contentHtml = htmldynmodule.getHtmlStringWithIdValues(templateHtml, values)

                var notices = []

                blNotices.listNoticesBySchool({name: "Management"}, (schoolNotices) => {
                    notices = notices.concat(schoolNotices)
                })

                blCourses.listCoursesForStudent({_id: currentUser[userType]}, (courses) => {
                    var index = 0
                    var repeater = (courseNotices) => {
                        notices = notices.concat(courseNotices)

                        if(index == courses.length) {
                            performLast()
                            return
                        }

                        blNotices.listNoticesByCourse(courses[index++], repeater)
                    }
                    blNotices.listNoticesByCourse(courses[index++], repeater)
                })
                
                var performLast = () => {

                    console.log(notices)

                    values.table = makeTable(notices)

                    res.end(
                        htmldynmodule.getHtmlStringWithIdValues(contentHtml, values)
                    )
                }
            })
        })

    })
}

var makeTable = (notices) => {
    var html = ''

    for(var notice of notices) {

        var eleSmall = htmldynmodule.getHtmlTagString('small', `${new Date(notice.dateTime).toLocaleString()}`, 'code')
        var eleTdTitle = htmldynmodule.getHtmlTagString('td', `posted for 🏫 ${notice.school || notice.course} ${eleSmall}`, 'title')
        var eleTdContent = htmldynmodule.getHtmlTagString('td', `${notice.content}`, 'content')

        var eleTr = htmldynmodule.getHtmlTagString('tr', eleTdTitle + eleTdContent, 'card')

        html += eleTr
    }

    return html
}