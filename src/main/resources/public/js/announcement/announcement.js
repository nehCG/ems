layui.use(['table', 'layer','jquery', 'jquery_cookie'], function() {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table,
        cookie = layui.jquery_cookie($);
    // Function to get logged-in user's information
    function getLoggedInUserName() {
        return $.cookie('userName');
    }
    var loggedInUserName = getLoggedInUserName();
    // Initialize userMap to hold userID: userName pairs
    var userMap = {};
    var tableIns;

    function fetchUserData(callback) {
        $.ajax({
            url: ctx + '/user/list',
            type: 'GET',
            async: false,
            success: function(response) {
                var users = response.data;
                for (var i = 0; i < users.length; i++) {
                    userMap[users[i].id] = users[i].userName;
                }
                // Once data is loaded, call the callback function
                if (typeof callback === "function") {
                    callback();
                }
            },
            error: function(err) {
                console.error("Error fetching users:", err);
            }
        });
    }

    function renderTable() {
        tableIns = table.render({
            id: 'announcementTable',
            elem: '#announcementList',
            height: 'full-125',
            cellMinWidth: 95,
            url: ctx + '/announcement/all', // URL to fetch announcements
            page: true,
            limit: 10,
            limits: [10, 20, 30, 40, 50],
            toolbar: '#toolbarDemo',
            cols: [[
                {field: 'uid', title: 'Posted By', align: 'center', templet: function(d) {
                        return userMap[d.uid] || 'Unknown'; // Use the userMap to get the userName for each uid
                    }},
                {field: 'subject', title: 'Subject', align: 'center'},
                {field: 'content', title: 'Content', align: 'center'},
                {field: 'modifiedTime', title: 'Last Updated On', align: 'center', templet: function(d) {
                        // Use modifiedTime if it's not empty, otherwise use createdTime
                        return d.modifiedTime || d.createdTime;
                    }},
                {title:'Operate', templet: function(d) {
                        if (userMap[d.uid] === loggedInUserName) {
                            return '<a class="layui-btn layui-btn-xs" lay-event="edit">Edit</a>' +
                                '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">Delete</a>';
                        } else {
                            return 'View Only'; // No buttons if user IDs don't match
                        }
                    }, fixed: 'right', align:'center', minWidth:150}
            ]]
        });

        return tableIns;
    }

// Fetch user data, then render the table
    fetchUserData(renderTable);
    window.userMap = userMap;
    top.userMap = userMap;
    console.log(userMap, window.userMap)

    // Toolbar event handling
    table.on('toolbar(announcements)', function(data) {
        if (data.event === "add") {
            openAddOrUpdateAnnouncementDialog(data.data);
        }
        // else if (data.event === "del") {
        //     var checkStatus = table.checkStatus(data.config.id);
        //     deleteAnnouncements(checkStatus.data);
        // }
    });

    // Function to delete announcements
    function deleteAnnouncement(id) {
        layer.confirm('Confirm to delete?',{icon:3, title:"Announcement Management"}, function (index) {
            layer.close(index);

            $.ajax({
                type:"delete",
                url:ctx + "/announcement/delete/"+id,
                success:function (result) {
                    if (result.code == 200) {
                        layer.msg("Deleted!",{icon:6});
                        tableIns.reload();
                    } else {
                        layer.msg(result.msg, {icon:5});
                    }
                }
            });
        });
    }

    // Function to handle add or update announcement dialog
    function openAddOrUpdateAnnouncementDialog(announcementId) {
        // redirect url and populate title based on announcementID presence
        var title = announcementId ? "<h3>Announcement - Update Announcement</h3>" : "<h3>Announcement - Add Announcement</h3>";
        var url = ctx + "/announcement/toAddOrUpdateAnnouncementPage" + (announcementId ? "?id=" + announcementId : "");

        layui.layer.open({
            type: 2,
            title: title,
            area: ['650px', '400px'],
            content: url,
            maxmin:true
        });
    }
    function fetchAnnouncementData(announcementId) {
        $.ajax({
            url: ctx + '/announcement/' + announcementId,
            type: 'GET',
            success: function(response) {
                // Populate the form with the response data
                console.log(response)
                populateAnnouncementForm(response);

            },
            error: function(err) {
                console.error("Error fetching announcement:", err);
            }
        });
    }
    function populateAnnouncementForm(data) {
        // Populate the form fields with the data
        console.log(data)
        $('#Subject').val(data.subject);
        $('#Content').val(data.content);
    }
    // Row event handling
    table.on('tool(announcements)', function(data) {
        if (data.event === "edit") {
            openAddOrUpdateAnnouncementDialog(data.data.id);
        } else if (data.event === "del") {
            deleteAnnouncement(data.data.id);
        }
    });

    // Function to delete a single announcement
    // function deleteAnnouncements(id) {
    //     // Implementation similar to deleteUser in your user.js
    // }

});