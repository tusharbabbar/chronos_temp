angular.module('chronos').controller('curationCtrl', ['$scope',
    '$window',
    'ticketCurationService',
    'UserApi',
    'SourcesListApi',
    'ProductsListApi',
    'TypesListApi',
    'TeamsListApi',
    'TeamMembersListApi',
    'TicketTagApi',
    'TicketCommentsListApi',
    'TicketApi',
    'ticketFilterService',
    'Flash',
    'transitNew',
    function($scope,
        $window,
        ticketCurationService,
        UserApi,
        SourcesListApi,
        ProductsListApi,
        TypesListApi,
        TeamsListApi,
        TeamMembersListApi,
        TicketTagApi,
        TicketCommentsListApi,
        TicketApi,
        ticketFilterService,
        Flash,
        transitNew) {
        //initialization function
        $scope.onetimeInitialization = function() {
            $scope.data = $scope.data ? $scope.data : {};
            $scope.data.statustesLength = 2;
            $scope.singleSelectSetting = {
                selectionLimit: 1
            };
            $scope.data.sentiments = [{
                name: 'Happy'
            }, {
                name: 'Neutral'
            }, {
                name: 'Angry'
            }];
            $scope.data.statuses = [{
                name: 'RESOLVED'
            }, {
                name: 'INVALID'
            }];
        }
        $scope.onetimeInitialization();

        $scope.ticketDataReset = function() {
            $scope.data.comment = ""
            $scope.data.comments = [];
            $scope.data.showComment = false;
            $scope.data.mail = {
                'send_default_mail': true,
                'subject': '',
                'body': '',
                'to': '',
                'do_not_sendmail': false,
            };
            var items = ['product', 'status', 'sentiment', 'type', 'source', 'owner',
                'assigned', 'assignedTeam', 'ownerTeam', 'tags'
            ]
            for (i = 0; i < items.length; i++) {
                $scope.data[items[i]] = [];
            }
        };

        //reset set values of ownerTeams and assignedTeams
        $scope.reset = function() {
            //reset owner team
            for (i in $scope.data.ownerTeams) {
                $scope.data.ownerTeams[i].ticked = false;
            }
            // reset owner
            for (i in $scope.data.assignedTeams) {
                $scope.data.assignedTeams[i].ticked = false;
            }
        }

        $scope.updateData = function(data) {
            //set status
            if (!(data.status == "RESOLVED" || data.status == "INVALID")) {
                if ($scope.data.statuses.length == $scope.data.statustesLength) {
                    $scope.data.statuses.push({
                        name: data.status
                    });
                } else {
                    $scope.data.statuses[$scope.data.statustesLength] = {
                        name: data.status
                    };
                }
            }
            var items = ['statuses', 'types', 'sources', 'products', 'sentiments'];
            var mapping = {
                statuses: 'status',
                types: 'type',
                sources: 'source',
                products: 'product',
                sentiments: 'sentiment'
            }
            for (var i = 0; i < items.length; i++) {
                for (j in $scope.data[items[i]]) {
                    currentItem = $scope.data[items[i]][j];
                    if (currentItem.name == data[mapping[items[i]]]) {
                        currentItem.ticked = true;
                        $scope.data[mapping[items[i]]][0] = currentItem;
                    } else {
                        currentItem.ticked = false;
                    }
                }
            }
            //set owner team
            if (data.owner_details && data.owner_details.team) {
                $scope.ticketData.ownerTeam = data.owner_details.team;
                $scope.ticketData.owner = data.owner_details.member;
                for (i in $scope.data.ownerTeams) {
                    currentOwnerTeam = $scope.data.ownerTeams[i];
                    if (currentOwnerTeam.name == data.owner_details.team.name) {
                        currentOwnerTeam.ticked = true;
                        $scope.data.ownerTeam = currentOwnerTeam;
                        $scope.getOwnerTeamMembers(currentOwnerTeam, data.owner_details.member);
                        break;
                    }
                }
            }
            //set assigned team
            if (data.assignment_details && data.assignment_details.team) {
                $scope.ticketData.assignedTeam = data.assignment_details.team;
                $scope.ticketData.assigned = data.assignment_details.member;
                for (i in $scope.data.assignedTeams) {
                    currentAssignedTeam = $scope.data.assignedTeams[i];
                    if (currentAssignedTeam.name == data.assignment_details.team.name) {
                        currentAssignedTeam.ticked = true;
                        $scope.data.assignedTeam = currentAssignedTeam;
                        $scope.getAssignedTeamMembers(currentAssignedTeam, data.assignment_details.member);
                        break;
                    }
                }
            }

        };
        //get ticket detail
        $scope.showTicket = function() {
            $scope.ticketDataReset();
            $scope.reset();
            $scope.data.ticketId = ticketCurationService.getTicketId();

            TicketApi.get({
                id: $scope.data.ticketId
            }, function(data) {
                $scope.ticket = data;
                //saving current ticket data
                $scope.ticketData = data;
                $scope.ticketData.ownerTeam = {};
                $scope.ticketData.owner = {};
                $scope.ticketData.assignedTeam = {};
                $scope.ticketData.assigned = {};
                $scope.updateData(data);
                TicketTagApi.get({
                    ticket_id: $scope.data.ticketId
                }, function(data) {
                    var tags = data.tags;
                    $scope.tagsData = [];
                    $scope.data.tags = [];
                    if (tags != []) {
                        for (var i = 0; i < tags.length; i++) {
                            $scope.data.tags.push({
                                text: tags[i]
                            });
                            $scope.tagsData.push(tags[i]);
                        }
                    }
                });
                //get ticket comments
                TicketCommentsListApi.query({
                    ticket_id: $scope.data.ticketId
                }, function(data) {
                    for (var i = 0; i < data.comments.length; i++) {
                        var date = new Date(data.comments[i]['created_on'] * 1000)
                        data.comments[i]['date'] = date.toString()
                    }
                    $scope.comments = data.comments;
                });
            });
        };

        $scope.updateComments = function() {
            $scope.comments = []
            TicketCommentsListApi.query({
                ticket_id: $scope.data.ticketId
            }, function(data) {
                for (var i = 0; i < data.comments.length; i++) {
                    var date = new Date(data.comments[i]['created_on'] * 1000)
                    data.comments[i]['date'] = date.toString()
                }
                $scope.comments = data.comments;
                $(".ticket-description").animate({
                    scrollTop: $(".ticket-description")[0].scrollHeight + 10000
                }, 750)
            });
        }

        $scope.getOwnerTeamMembers = function(data, memberInfo) {
            memberInfo = typeof memberInfo !== 'undefined' ? memberInfo : false;
            TeamMembersListApi.get({
                team_id: data.id
            }, function(data) {
                for (i in data.members) {
                    member = data.members[i];
                    member.name = member.user.name;
                }
                $scope.data.ownerTeamMembers = data.members;
                if (memberInfo) {
                    for (i in $scope.data.ownerTeamMembers) {
                        ownerTeamMember = $scope.data.ownerTeamMembers[i];
                        if (memberInfo.id == ownerTeamMember.id) {
                            ownerTeamMember.ticked = true;
                            $scope.data.owner[0] = ownerTeamMember;
                        } else {
                            ownerTeamMember.ticked = false;
                        }
                    }
                }
            }, function(errorData) {
                $scope.ownerTeamMembers = [];
            });
        };

        $scope.getAssignedTeamMembers = function(data, memberInfo) {
            TeamMembersListApi.get({
                team_id: data.id
            }, function(data) {
                for (i in data.members) {
                    member = data.members[i];
                    member.name = member.user.name;
                }
                $scope.data.assignedTeamMembers = data.members;
                if (memberInfo) {
                    for (i in $scope.data.assignedTeamMembers) {
                        assignedTeamMember = $scope.data.assignedTeamMembers[i];
                        if (memberInfo.id == assignedTeamMember.id) {
                            assignedTeamMember.ticked = true;
                            $scope.data.assigned[0] = assignedTeamMember;
                        } else {
                            assignedTeamMember.ticked = false;
                        }
                    }
                }
            }, function(errorData) {
                $scope.assignedTeamMembers = [];
            });
        };

        $scope.checkSave = function() {
            if ($scope.data['assignedTeam'].length) {
                $scope.data.showCustomMail = true;
            } else {
                $scope.save();
            }
        };

        $scope.removeModal = function() {
            $scope.data.showCustomMail = false;
        };

        $scope.save = function() {
            var data = {};
            if ($scope.data.showCustomMail) {
                if ($scope.data.mail.do_not_sendmail == true) {
                    $scope.data.showCustomMail = false;
                } else if ($scope.data.mail.send_default_mail === true) {
                    data.send_custom_mail = 1;
                } else {
                    if (($scope.data.mail.subject != "") && ($scope.data.mail.to != "") && ($scope.data.mail.body != "")) {
                        data.send_custom_mail = 0;
                        data.subject = $scope.data.mail.subject;
                        data.body = $scope.data.mail.body;
                        data.recipient = $scope.data.mail.to;
                    } else {
                        Flash.create('danger', "Must specify Subject, Body and To");
                        return;
                    }
                }
            }
            data.id = $scope.data.ticketId;
            var items = ['product', 'type', 'source']
            var mapping = {
                product: 'product_id',
                type: 'type_id',
                source: 'source_id'
            }
            for (var i = 0; i < items.length; i++) {
                if ($scope.data[items[i]].length && $scope.data[items[i]][0].name != $scope.ticketData[items[i]]) {
                    data[mapping[items[i]]] = $scope.data[items[i]][0].id;
                }
            }

            var items1 = ['ownerTeam', 'owner', 'assignedTeam', 'assigned'];
            var mapping1 = {
                ownerTeam: 'set_owner_team',
                owner: 'set_owner_member',
                assignedTeam: 'assign_to_team',
                assigned: 'assign_to_member',
            };
            for (var i = 0; i < items1.length; i++) {
                selectedItem = $scope.data[items1[i]];
                if ($scope.data[items1[i]].length && selectedItem[0].id != $scope.ticketData[items1[i]].id) {
                    data[mapping1[items1[i]]] = selectedItem[0].id;
                }
            }

            if ($scope.data.sentiment.length && $scope.data.sentiment[0].name != $scope.ticketData['sentiment']) {
                data.sentiment = $scope.data.sentiment[0].name;
            }
            console.log($scope.data.status);
            if ($scope.data.status.length && $scope.data.status[0].name === 'INVALID' || $scope.data.status[0].name === 'RESOLVED') {
                data.status = $scope.data.status[0].name;
            }

            if ($scope.data.followUpOf && $scope.data.followUpOf != $scope.ticketData['child_of']) {
                data.set_followup_of = $scope.data.followUpOf;
            }

            var dataTags = [];
            for (i = 0; i < $scope.data.tags.length; i++) {
                if ($scope.tagsData.indexOf($scope.data.tags[i].text) == -1) {
                    dataTags.push($scope.data.tags[i].text);
                }
            }
            if (dataTags.length > 0) {
                data.tags = dataTags;
            }
            console.log("ticket data sent is ", data);
            if (Object.keys(data).length > 1) {
                TicketApi.update(data, function(data) {
                    $scope.data.mail.body = "";
                    $scope.data.mail.subject = "";
                    $scope.data.mail.to = "";
                    $scope.data.showCustomMail = false;
                    transitNew.data.showCuration(0);
                    Flash.create('success', "Ticket Saved Successfully!!!");
                    ticketFilterService.update_tickets_with_filters()
                });
            } else {
                $scope.data.showCustomMail = false;
                Flash.create('danger', "No change in ticket data");
            }
        };
        //close curation screen
        $scope.cancel = function() {
            transitNew.data.showCuration(0);
        };

        //search user from users api for mention
        $scope.searchPeople = function(term) {
            console.log(term)
            if (term.length > 3) {
                UserApi.get({
                    query: term
                }, function(data) {
                    $scope.items = data.users;
                });
            }
        };
        //select user for mention
        $scope.getSelectedUser = function(item) {
            return "<span style='color: #4DC5EA;' id='" + item.id + "'>" + "@" + item.name + "</span>";
        };

        //select user email
        $scope.getSelectedEmail = function(item) {
            return item.email + ","
        };

        //add comment on ticket
        $scope.addComment = function() {
            if (($scope.data.comment != "") && ($scope.data.comment.length > 10)) {
                data = {
                    ticket_id: $scope.data.ticketId,
                    body: $scope.data.comment
                }

                TicketCommentsListApi.save(data, function(data) {
                    $scope.data.comment = "";
                    $scope.toggleComment()
                    $scope.updateComments()
                    Flash.create('success', "Comment Added Successfully!!!");
                });
            } else {
                Flash.create('danger', "html Variable must be greater than 10 chars");
            }
        };

        //hide comment box
        $scope.toggleComment = function() {
            $scope.data.showComment = !$scope.data.showComment;
        }
    }
]);
