/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/activities/route";
exports.ids = ["app/api/activities/route"];
exports.modules = {

/***/ "(rsc)/./app/api/activities/route.ts":
/*!*************************************!*\
  !*** ./app/api/activities/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase/server */ \"(rsc)/./lib/supabase/server.ts\");\n\n\nfunction formatTimestamp(timestamp) {\n    const now = new Date();\n    const activityTime = new Date(timestamp);\n    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));\n    if (diffInMinutes < 1) return \"Agora mesmo\";\n    if (diffInMinutes < 60) return `${diffInMinutes} minuto${diffInMinutes > 1 ? \"s\" : \"\"} atrás`;\n    const diffInHours = Math.floor(diffInMinutes / 60);\n    if (diffInHours < 24) return `${diffInHours} hora${diffInHours > 1 ? \"s\" : \"\"} atrás`;\n    const diffInDays = Math.floor(diffInHours / 24);\n    if (diffInDays === 1) return \"Ontem\";\n    if (diffInDays < 7) return `${diffInDays} dias atrás`;\n    return activityTime.toLocaleDateString(\"pt-BR\");\n}\n// GET - Retrieve activities\nasync function GET(request) {\n    try {\n        const supabase = (0,_lib_supabase_server__WEBPACK_IMPORTED_MODULE_1__.createClient)();\n        // Get authenticated user\n        const { data: { user }, error: authError } = await supabase.auth.getUser();\n        if (authError || !user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                error: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        const url = new URL(request.url);\n        const limit = Number.parseInt(url.searchParams.get(\"limit\") || \"10\");\n        const since = url.searchParams.get(\"since\");\n        let query = supabase.from(\"activities\").select(\"*\").eq(\"user_id\", user.id).order(\"timestamp\", {\n            ascending: false\n        }).limit(limit);\n        // Filter by timestamp if 'since' parameter is provided\n        if (since) {\n            query = query.gt(\"timestamp\", since);\n        }\n        const { data: activities, error } = await query;\n        if (error) {\n            console.error(\"Database error:\", error);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                error: \"Failed to fetch activities\"\n            }, {\n                status: 500\n            });\n        }\n        // Format activities with relative timestamps\n        const formattedActivities = (activities || []).map((activity)=>({\n                ...activity,\n                timestamp: formatTimestamp(activity.timestamp)\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            data: formattedActivities,\n            total: formattedActivities.length\n        });\n    } catch (error) {\n        console.error(\"Error fetching activities:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            error: \"Failed to fetch activities\"\n        }, {\n            status: 500\n        });\n    }\n}\n// POST - Add new activity\nasync function POST(request) {\n    try {\n        const supabase = (0,_lib_supabase_server__WEBPACK_IMPORTED_MODULE_1__.createClient)();\n        // Get authenticated user\n        const { data: { user }, error: authError } = await supabase.auth.getUser();\n        if (authError || !user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                error: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        const body = await request.json();\n        const { type, description } = body;\n        // Validate required fields\n        if (!type || !description) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                error: \"Type and description are required\"\n            }, {\n                status: 400\n            });\n        }\n        const { data: newActivity, error } = await supabase.from(\"activities\").insert({\n            user_id: user.id,\n            type,\n            description\n        }).select().single();\n        if (error) {\n            console.error(\"Database error:\", error);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                success: false,\n                error: \"Failed to add activity\"\n            }, {\n                status: 500\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            data: {\n                ...newActivity,\n                timestamp: formatTimestamp(newActivity.timestamp)\n            },\n            message: \"Activity added successfully\"\n        });\n    } catch (error) {\n        console.error(\"Error adding activity:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            error: \"Failed to add activity\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1FBQzlGO1FBRUEsT0FBT3pCLHFEQUFZQSxDQUFDdUIsSUFBSSxDQUFDO1lBQ3ZCQyxTQUFTO1lBQ1RQLE1BQU07Z0JBQ0osR0FBR29DLFdBQVc7Z0JBQ2RsRCxXQUFXRCxnQkFBZ0JtRCxZQUFZbEQsU0FBUztZQUNsRDtZQUNBc0QsU0FBUztRQUNYO0lBQ0YsRUFBRSxPQUFPdEMsT0FBTztRQUNkd0IsUUFBUXhCLEtBQUssQ0FBQywwQkFBMEJBO1FBQ3hDLE9BQU9uQixxREFBWUEsQ0FBQ3VCLElBQUksQ0FBQztZQUFFQyxTQUFTO1lBQU9MLE9BQU87UUFBeUIsR0FBRztZQUFFTSxRQUFRO1FBQUk7SUFDOUY7QUFDRiIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxBbHVub3NcXERvY3VtZW50c1xcR2l0SHViXFxwcm9qZXRvLWJpb2dlbi12Mi1yZWFjdFxcYXBwXFxhcGlcXGFjdGl2aXRpZXNcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHR5cGUgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiXHJcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gXCJAL2xpYi9zdXBhYmFzZS9zZXJ2ZXJcIlxyXG5cclxuZnVuY3Rpb24gZm9ybWF0VGltZXN0YW1wKHRpbWVzdGFtcDogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXHJcbiAgY29uc3QgYWN0aXZpdHlUaW1lID0gbmV3IERhdGUodGltZXN0YW1wKVxyXG4gIGNvbnN0IGRpZmZJbk1pbnV0ZXMgPSBNYXRoLmZsb29yKChub3cuZ2V0VGltZSgpIC0gYWN0aXZpdHlUaW1lLmdldFRpbWUoKSkgLyAoMTAwMCAqIDYwKSlcclxuXHJcbiAgaWYgKGRpZmZJbk1pbnV0ZXMgPCAxKSByZXR1cm4gXCJBZ29yYSBtZXNtb1wiXHJcbiAgaWYgKGRpZmZJbk1pbnV0ZXMgPCA2MCkgcmV0dXJuIGAke2RpZmZJbk1pbnV0ZXN9IG1pbnV0byR7ZGlmZkluTWludXRlcyA+IDEgPyBcInNcIiA6IFwiXCJ9IGF0csOhc2BcclxuXHJcbiAgY29uc3QgZGlmZkluSG91cnMgPSBNYXRoLmZsb29yKGRpZmZJbk1pbnV0ZXMgLyA2MClcclxuICBpZiAoZGlmZkluSG91cnMgPCAyNCkgcmV0dXJuIGAke2RpZmZJbkhvdXJzfSBob3JhJHtkaWZmSW5Ib3VycyA+IDEgPyBcInNcIiA6IFwiXCJ9IGF0csOhc2BcclxuXHJcbiAgY29uc3QgZGlmZkluRGF5cyA9IE1hdGguZmxvb3IoZGlmZkluSG91cnMgLyAyNClcclxuICBpZiAoZGlmZkluRGF5cyA9PT0gMSkgcmV0dXJuIFwiT250ZW1cIlxyXG4gIGlmIChkaWZmSW5EYXlzIDwgNykgcmV0dXJuIGAke2RpZmZJbkRheXN9IGRpYXMgYXRyw6FzYFxyXG5cclxuICByZXR1cm4gYWN0aXZpdHlUaW1lLnRvTG9jYWxlRGF0ZVN0cmluZyhcInB0LUJSXCIpXHJcbn1cclxuXHJcbi8vIEdFVCAtIFJldHJpZXZlIGFjdGl2aXRpZXNcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gICAgLy8gR2V0IGF1dGhlbnRpY2F0ZWQgdXNlclxyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRhOiB7IHVzZXIgfSxcclxuICAgICAgZXJyb3I6IGF1dGhFcnJvcixcclxuICAgIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gICAgaWYgKGF1dGhFcnJvciB8fCAhdXNlcikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpXHJcbiAgICBjb25zdCBsaW1pdCA9IE51bWJlci5wYXJzZUludCh1cmwuc2VhcmNoUGFyYW1zLmdldChcImxpbWl0XCIpIHx8IFwiMTBcIilcclxuICAgIGNvbnN0IHNpbmNlID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJzaW5jZVwiKVxyXG5cclxuICAgIGxldCBxdWVyeSA9IHN1cGFiYXNlXHJcbiAgICAgIC5mcm9tKFwiYWN0aXZpdGllc1wiKVxyXG4gICAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgICAuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcbiAgICAgIC5vcmRlcihcInRpbWVzdGFtcFwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcclxuICAgICAgLmxpbWl0KGxpbWl0KVxyXG5cclxuICAgIC8vIEZpbHRlciBieSB0aW1lc3RhbXAgaWYgJ3NpbmNlJyBwYXJhbWV0ZXIgaXMgcHJvdmlkZWRcclxuICAgIGlmIChzaW5jZSkge1xyXG4gICAgICBxdWVyeSA9IHF1ZXJ5Lmd0KFwidGltZXN0YW1wXCIsIHNpbmNlKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgZGF0YTogYWN0aXZpdGllcywgZXJyb3IgfSA9IGF3YWl0IHF1ZXJ5XHJcblxyXG4gICAgaWYgKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJEYXRhYmFzZSBlcnJvcjpcIiwgZXJyb3IpXHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggYWN0aXZpdGllc1wiIH0sIHsgc3RhdHVzOiA1MDAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBGb3JtYXQgYWN0aXZpdGllcyB3aXRoIHJlbGF0aXZlIHRpbWVzdGFtcHNcclxuICAgIGNvbnN0IGZvcm1hdHRlZEFjdGl2aXRpZXMgPSAoYWN0aXZpdGllcyB8fCBbXSkubWFwKChhY3Rpdml0eSkgPT4gKHtcclxuICAgICAgLi4uYWN0aXZpdHksXHJcbiAgICAgIHRpbWVzdGFtcDogZm9ybWF0VGltZXN0YW1wKGFjdGl2aXR5LnRpbWVzdGFtcCksXHJcbiAgICB9KSlcclxuXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xyXG4gICAgICBzdWNjZXNzOiB0cnVlLFxyXG4gICAgICBkYXRhOiBmb3JtYXR0ZWRBY3Rpdml0aWVzLFxyXG4gICAgICB0b3RhbDogZm9ybWF0dGVkQWN0aXZpdGllcy5sZW5ndGgsXHJcbiAgICB9KVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgYWN0aXZpdGllczpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIGZldGNoIGFjdGl2aXRpZXNcIiB9LCB7IHN0YXR1czogNTAwIH0pXHJcbiAgfVxyXG59XHJcblxyXG4vLyBQT1NUIC0gQWRkIG5ldyBhY3Rpdml0eVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gICAgLy8gR2V0IGF1dGhlbnRpY2F0ZWQgdXNlclxyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRhOiB7IHVzZXIgfSxcclxuICAgICAgZXJyb3I6IGF1dGhFcnJvcixcclxuICAgIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gICAgaWYgKGF1dGhFcnJvciB8fCAhdXNlcikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKVxyXG4gICAgY29uc3QgeyB0eXBlLCBkZXNjcmlwdGlvbiB9ID0gYm9keVxyXG5cclxuICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIGZpZWxkc1xyXG4gICAgaWYgKCF0eXBlIHx8ICFkZXNjcmlwdGlvbikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiVHlwZSBhbmQgZGVzY3JpcHRpb24gYXJlIHJlcXVpcmVkXCIgfSwgeyBzdGF0dXM6IDQwMCB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgZGF0YTogbmV3QWN0aXZpdHksIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcImFjdGl2aXRpZXNcIilcclxuICAgICAgLmluc2VydCh7XHJcbiAgICAgICAgdXNlcl9pZDogdXNlci5pZCxcclxuICAgICAgICB0eXBlLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICB9KVxyXG4gICAgICAuc2VsZWN0KClcclxuICAgICAgLnNpbmdsZSgpXHJcblxyXG4gICAgaWYgKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJEYXRhYmFzZSBlcnJvcjpcIiwgZXJyb3IpXHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gYWRkIGFjdGl2aXR5XCIgfSwgeyBzdGF0dXM6IDUwMCB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICAuLi5uZXdBY3Rpdml0eSxcclxuICAgICAgICB0aW1lc3RhbXA6IGZvcm1hdFRpbWVzdGFtcChuZXdBY3Rpdml0eS50aW1lc3RhbXApLFxyXG4gICAgICB9LFxyXG4gICAgICBtZXNzYWdlOiBcIkFjdGl2aXR5IGFkZGVkIHN1Y2Nlc3NmdWxseVwiLFxyXG4gICAgfSlcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGFkZGluZyBhY3Rpdml0eTpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIGFkZCBhY3Rpdml0eVwiIH0sIHsgc3RhdHVzOiA1MDAgfSlcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImNyZWF0ZUNsaWVudCIsImZvcm1hdFRpbWVzdGFtcCIsInRpbWVzdGFtcCIsIm5vdyIsIkRhdGUiLCJhY3Rpdml0eVRpbWUiLCJkaWZmSW5NaW51dGVzIiwiTWF0aCIsImZsb29yIiwiZ2V0VGltZSIsImRpZmZJbkhvdXJzIiwiZGlmZkluRGF5cyIsInRvTG9jYWxlRGF0ZVN0cmluZyIsIkdFVCIsInJlcXVlc3QiLCJzdXBhYmFzZSIsImRhdGEiLCJ1c2VyIiwiZXJyb3IiLCJhdXRoRXJyb3IiLCJhdXRoIiwiZ2V0VXNlciIsImpzb24iLCJzdWNjZXNzIiwic3RhdHVzIiwidXJsIiwiVVJMIiwibGltaXQiLCJOdW1iZXIiLCJwYXJzZUludCIsInNlYXJjaFBhcmFtcyIsImdldCIsInNpbmNlIiwicXVlcnkiLCJmcm9tIiwic2VsZWN0IiwiZXEiLCJpZCIsIm9yZGVyIiwiYXNjZW5kaW5nIiwiZ3QiLCJhY3Rpdml0aWVzIiwiY29uc29sZSIsImZvcm1hdHRlZEFjdGl2aXRpZXMiLCJtYXAiLCJhY3Rpdml0eSIsInRvdGFsIiwibGVuZ3RoIiwiUE9TVCIsImJvZHkiLCJ0eXBlIiwiZGVzY3JpcHRpb24iLCJuZXdBY3Rpdml0eSIsImluc2VydCIsInVzZXJfaWQiLCJzaW5nbGUiLCJtZXNzYWdlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/activities/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase/server.ts":
/*!********************************!*\
  !*** ./lib/supabase/server.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createClient: () => (/* binding */ createClient),\n/* harmony export */   isSupabaseConfigured: () => (/* binding */ isSupabaseConfigured)\n/* harmony export */ });\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/auth-helpers-nextjs */ \"(rsc)/./node_modules/@supabase/auth-helpers-nextjs/dist/index.js\");\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n// Check if Supabase environment variables are available\nconst isSupabaseConfigured =  true && \"https://scsldapnrzpjkyqkeiop.supabase.co\".length > 0 && \"string\" === \"string\" && \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjc2xkYXBucnpwamt5cWtlaW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTYyMzksImV4cCI6MjA3MTEzMjIzOX0.TxRPb6uaLdCCBdjvjKOghvaD7EBPlA2rZqTfh8gPdBw\".length > 0;\n// Create a cached version of the Supabase client for Server Components\nconst createClient = (0,react__WEBPACK_IMPORTED_MODULE_2__.cache)(()=>{\n    const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    if (!isSupabaseConfigured) {\n        console.warn(\"Supabase environment variables are not set. Using dummy client.\");\n        return {\n            auth: {\n                getUser: ()=>Promise.resolve({\n                        data: {\n                            user: null\n                        },\n                        error: null\n                    }),\n                getSession: ()=>Promise.resolve({\n                        data: {\n                            session: null\n                        },\n                        error: null\n                    })\n            }\n        };\n    }\n    return (0,_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0__.createServerComponentClient)({\n        cookies: ()=>cookieStore\n    });\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2Uvc2VydmVyLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMkU7QUFDckM7QUFDVDtBQUU3Qix3REFBd0Q7QUFDakQsTUFBTUcsdUJBQ1gsS0FBd0QsSUFDeERDLDBDQUFvQyxDQUFDRyxNQUFNLEdBQUcsS0FDOUMsUUFBZ0QsS0FBSyxZQUNyREgsa05BQXlDLENBQUNHLE1BQU0sR0FBRyxFQUFDO0FBRXRELHVFQUF1RTtBQUNoRSxNQUFNRSxlQUFlUCw0Q0FBS0EsQ0FBQztJQUNoQyxNQUFNUSxjQUFjVCxxREFBT0E7SUFFM0IsSUFBSSxDQUFDRSxzQkFBc0I7UUFDekJRLFFBQVFDLElBQUksQ0FBQztRQUNiLE9BQU87WUFDTEMsTUFBTTtnQkFDSkMsU0FBUyxJQUFNQyxRQUFRQyxPQUFPLENBQUM7d0JBQUVDLE1BQU07NEJBQUVDLE1BQU07d0JBQUs7d0JBQUdDLE9BQU87b0JBQUs7Z0JBQ25FQyxZQUFZLElBQU1MLFFBQVFDLE9BQU8sQ0FBQzt3QkFBRUMsTUFBTTs0QkFBRUksU0FBUzt3QkFBSzt3QkFBR0YsT0FBTztvQkFBSztZQUMzRTtRQUNGO0lBQ0Y7SUFFQSxPQUFPbkIsMEZBQTJCQSxDQUFDO1FBQUVDLFNBQVMsSUFBTVM7SUFBWTtBQUNsRSxHQUFFIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEFsdW5vc1xcRG9jdW1lbnRzXFxHaXRIdWJcXHByb2pldG8tYmlvZ2VuLXYyLXJlYWN0XFxsaWJcXHN1cGFiYXNlXFxzZXJ2ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2VydmVyQ29tcG9uZW50Q2xpZW50IH0gZnJvbSBcIkBzdXBhYmFzZS9hdXRoLWhlbHBlcnMtbmV4dGpzXCJcclxuaW1wb3J0IHsgY29va2llcyB9IGZyb20gXCJuZXh0L2hlYWRlcnNcIlxyXG5pbXBvcnQgeyBjYWNoZSB9IGZyb20gXCJyZWFjdFwiXHJcblxyXG4vLyBDaGVjayBpZiBTdXBhYmFzZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgYXJlIGF2YWlsYWJsZVxyXG5leHBvcnQgY29uc3QgaXNTdXBhYmFzZUNvbmZpZ3VyZWQgPVxyXG4gIHR5cGVvZiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwgPT09IFwic3RyaW5nXCIgJiZcclxuICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwubGVuZ3RoID4gMCAmJlxyXG4gIHR5cGVvZiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSA9PT0gXCJzdHJpbmdcIiAmJlxyXG4gIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZLmxlbmd0aCA+IDBcclxuXHJcbi8vIENyZWF0ZSBhIGNhY2hlZCB2ZXJzaW9uIG9mIHRoZSBTdXBhYmFzZSBjbGllbnQgZm9yIFNlcnZlciBDb21wb25lbnRzXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVDbGllbnQgPSBjYWNoZSgoKSA9PiB7XHJcbiAgY29uc3QgY29va2llU3RvcmUgPSBjb29raWVzKClcclxuXHJcbiAgaWYgKCFpc1N1cGFiYXNlQ29uZmlndXJlZCkge1xyXG4gICAgY29uc29sZS53YXJuKFwiU3VwYWJhc2UgZW52aXJvbm1lbnQgdmFyaWFibGVzIGFyZSBub3Qgc2V0LiBVc2luZyBkdW1teSBjbGllbnQuXCIpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhdXRoOiB7XHJcbiAgICAgICAgZ2V0VXNlcjogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgZGF0YTogeyB1c2VyOiBudWxsIH0sIGVycm9yOiBudWxsIH0pLFxyXG4gICAgICAgIGdldFNlc3Npb246ICgpID0+IFByb21pc2UucmVzb2x2ZSh7IGRhdGE6IHsgc2Vzc2lvbjogbnVsbCB9LCBlcnJvcjogbnVsbCB9KSxcclxuICAgICAgfSxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBjcmVhdGVTZXJ2ZXJDb21wb25lbnRDbGllbnQoeyBjb29raWVzOiAoKSA9PiBjb29raWVTdG9yZSB9KVxyXG59KVxyXG4iXSwibmFtZXMiOlsiY3JlYXRlU2VydmVyQ29tcG9uZW50Q2xpZW50IiwiY29va2llcyIsImNhY2hlIiwiaXNTdXBhYmFzZUNvbmZpZ3VyZWQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwibGVuZ3RoIiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkiLCJjcmVhdGVDbGllbnQiLCJjb29raWVTdG9yZSIsImNvbnNvbGUiLCJ3YXJuIiwiYXV0aCIsImdldFVzZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsImRhdGEiLCJ1c2VyIiwiZXJyb3IiLCJnZXRTZXNzaW9uIiwic2Vzc2lvbiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase/server.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Factivities%2Froute&page=%2Fapi%2Factivities%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Factivities%2Froute.ts&appDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Factivities%2Froute&page=%2Fapi%2Factivities%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Factivities%2Froute.ts&appDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Alunos_Documents_GitHub_projeto_biogen_v2_react_app_api_activities_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/activities/route.ts */ \"(rsc)/./app/api/activities/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/activities/route\",\n        pathname: \"/api/activities\",\n        filename: \"route\",\n        bundlePath: \"app/api/activities/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Alunos\\\\Documents\\\\GitHub\\\\projeto-biogen-v2-react\\\\app\\\\api\\\\activities\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Alunos_Documents_GitHub_projeto_biogen_v2_react_app_api_activities_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhY3Rpdml0aWVzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhY3Rpdml0aWVzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYWN0aXZpdGllcyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNBbHVub3MlNUNEb2N1bWVudHMlNUNHaXRIdWIlNUNwcm9qZXRvLWJpb2dlbi12Mi1yZWFjdCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDQWx1bm9zJTVDRG9jdW1lbnRzJTVDR2l0SHViJTVDcHJvamV0by1iaW9nZW4tdjItcmVhY3QmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzZDO0FBQzFIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxBbHVub3NcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxwcm9qZXRvLWJpb2dlbi12Mi1yZWFjdFxcXFxhcHBcXFxcYXBpXFxcXGFjdGl2aXRpZXNcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2FjdGl2aXRpZXMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hY3Rpdml0aWVzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hY3Rpdml0aWVzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcQWx1bm9zXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxccHJvamV0by1iaW9nZW4tdjItcmVhY3RcXFxcYXBwXFxcXGFwaVxcXFxhY3Rpdml0aWVzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Factivities%2Froute&page=%2Fapi%2Factivities%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Factivities%2Froute.ts&appDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/set-cookie-parser","vendor-chunks/webidl-conversions","vendor-chunks/jose"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Factivities%2Froute&page=%2Fapi%2Factivities%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Factivities%2Froute.ts&appDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();