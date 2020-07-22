export default {
    getVisibleRole(role_json, node, action) {
        try {
            let role_list = JSON.parse(role_json)

            switch (action) {
                case "create":
                    if (role_list[node] && role_list[node]['31']) {
                        return true
                    }
                    else {
                        return false
                    }
                    break;
                case "read":
                    if (role_list[node] && role_list[node]['13']) {
                        return true
                    }
                    if (role_list[node] && role_list[node]['12']) {
                        return true
                    }
                    if (role_list[node] && role_list[node]['11']) {
                        return true
                    }
                    else {
                        return false
                    }
                    break;
                case "update":
                    if (role_list[node] && role_list[node]['23']) {
                        return true
                    }
                    if (role_list[node] && role_list[node]['22']) {
                        return true
                    }
                    if (role_list[node] && role_list[node]['21']) {
                        return true
                    }
                    else {
                        return false
                    }
                    break;
                case "delete":
                    if (role_list[node] && role_list[node]['43']) {
                        return true
                    }
                    if (role_list[node] && role_list[node]['42']) {
                        return true
                    }
                    if (role_list[node] && role_list[node]['41']) {
                        return true
                    }
                    else {
                        return false
                    }
                    break;
            }
        } catch (error) {
          
        }

    },
    getApiRole(role_json,node, action) {
        try {
            let role_list = JSON.parse(role_json)

            switch (action) {
                case "create":
                    if (role_list[node] && role_list[node]['31']) {
                        return role_list[node]['31']['role_api'];
                    }
                    else {
                        return false
                    }
                    break;
                case "read":
                    if (role_list[node] && role_list[node]['13']) {
                        return role_list[node]['13']['role_api'];
                    }
                    if (role_list[node] && role_list[node]['12']) {
                        return role_list[node]['12']['role_api'];
                    }
                    if (role_list[node] && role_list[node]['11']) {
                        return role_list[node]['11']['role_api'];
                    }
                    else {
                        return false
                    }
                    break;
                case "update":
                    if (role_list[node] && role_list[node]['23']) {
                        return role_list[node]['23']['role_api'];
                    }
                    if (role_list[node] && role_list[node]['22']) {
                        return role_list[node]['22']['role_api'];
                    }
                    if (role_list[node] && role_list[node]['21']) {
                        return role_list[node]['21']['role_api'];
                    }
                    else {
                        return false
                    }
                    break;
                case "delete":
                    if (role_list[node] && role_list[node]['43']) {
                        return role_list[node]['43']['role_api'];
                    }
                    if (role_list[node] && role_list[node]['42']) {
                        return role_list[node]['43']['role_api'];
                    }
                    if (role_list[node] && role_list[node]['41']) {
                        return role_list[node]['41']['role_api'];
                    }
                    else {
                        return false
                    }
                    break;
            }
        } catch (error) {
            
        }
    }
}