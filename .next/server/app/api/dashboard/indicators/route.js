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
exports.id = "app/api/dashboard/indicators/route";
exports.ids = ["app/api/dashboard/indicators/route"];
exports.modules = {

/***/ "(rsc)/./app/api/dashboard/indicators/route.ts":
/*!***********************************************!*\
  !*** ./app/api/dashboard/indicators/route.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase/client */ \"(rsc)/./lib/supabase/client.ts\");\n\n\nasync function GET() {\n    try {\n        const { data: indicators, error } = await _lib_supabase_client__WEBPACK_IMPORTED_MODULE_1__.supabase.from(\"biodigester_indicators\").select(\"name, current_value, unit, status\").in(\"name\", [\n            \"Energia Gerada\",\n            \"Resíduos Processados\",\n            \"Imposto Abatido\"\n        ]).order(\"created_at\", {\n            ascending: true\n        });\n        if (error) throw error;\n        // Format data for dashboard consumption\n        const dashboardData = {\n            energyGenerated: indicators?.find((i)=>i.name === \"Energia Gerada\")?.current_value || 0,\n            wasteProcessed: indicators?.find((i)=>i.name === \"Resíduos Processados\")?.current_value || 0,\n            taxSavings: indicators?.find((i)=>i.name === \"Imposto Abatido\")?.current_value || 0\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(dashboardData);\n    } catch (error) {\n        console.error(\"Error fetching dashboard indicators:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch indicators\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2Rhc2hib2FyZC9pbmRpY2F0b3JzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwQztBQUNNO0FBRXpDLGVBQWVFO0lBQ3BCLElBQUk7UUFDRixNQUFNLEVBQUVDLE1BQU1DLFVBQVUsRUFBRUMsS0FBSyxFQUFFLEdBQUcsTUFBTUosMERBQVFBLENBQy9DSyxJQUFJLENBQUMsMEJBQ0xDLE1BQU0sQ0FBQyxxQ0FDUEMsRUFBRSxDQUFDLFFBQVE7WUFBQztZQUFrQjtZQUF3QjtTQUFrQixFQUN4RUMsS0FBSyxDQUFDLGNBQWM7WUFBRUMsV0FBVztRQUFLO1FBRXpDLElBQUlMLE9BQU8sTUFBTUE7UUFFakIsd0NBQXdDO1FBQ3hDLE1BQU1NLGdCQUFnQjtZQUNwQkMsaUJBQWlCUixZQUFZUyxLQUFLLENBQUNDLElBQU1BLEVBQUVDLElBQUksS0FBSyxtQkFBbUJDLGlCQUFpQjtZQUN4RkMsZ0JBQWdCYixZQUFZUyxLQUFLLENBQUNDLElBQU1BLEVBQUVDLElBQUksS0FBSyx5QkFBeUJDLGlCQUFpQjtZQUM3RkUsWUFBWWQsWUFBWVMsS0FBSyxDQUFDQyxJQUFNQSxFQUFFQyxJQUFJLEtBQUssb0JBQW9CQyxpQkFBaUI7UUFDdEY7UUFFQSxPQUFPaEIscURBQVlBLENBQUNtQixJQUFJLENBQUNSO0lBQzNCLEVBQUUsT0FBT04sT0FBTztRQUNkZSxRQUFRZixLQUFLLENBQUMsd0NBQXdDQTtRQUN0RCxPQUFPTCxxREFBWUEsQ0FBQ21CLElBQUksQ0FBQztZQUFFZCxPQUFPO1FBQTZCLEdBQUc7WUFBRWdCLFFBQVE7UUFBSTtJQUNsRjtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEFsdW5vc1xcRG9jdW1lbnRzXFxHaXRIdWJcXHByb2pldG8tYmlvZ2VuLXYyLXJlYWN0XFxhcHBcXGFwaVxcZGFzaGJvYXJkXFxpbmRpY2F0b3JzXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxyXG5pbXBvcnQgeyBzdXBhYmFzZSB9IGZyb20gXCJAL2xpYi9zdXBhYmFzZS9jbGllbnRcIlxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBkYXRhOiBpbmRpY2F0b3JzLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJiaW9kaWdlc3Rlcl9pbmRpY2F0b3JzXCIpXHJcbiAgICAgIC5zZWxlY3QoXCJuYW1lLCBjdXJyZW50X3ZhbHVlLCB1bml0LCBzdGF0dXNcIilcclxuICAgICAgLmluKFwibmFtZVwiLCBbXCJFbmVyZ2lhIEdlcmFkYVwiLCBcIlJlc8OtZHVvcyBQcm9jZXNzYWRvc1wiLCBcIkltcG9zdG8gQWJhdGlkb1wiXSlcclxuICAgICAgLm9yZGVyKFwiY3JlYXRlZF9hdFwiLCB7IGFzY2VuZGluZzogdHJ1ZSB9KVxyXG5cclxuICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3JcclxuXHJcbiAgICAvLyBGb3JtYXQgZGF0YSBmb3IgZGFzaGJvYXJkIGNvbnN1bXB0aW9uXHJcbiAgICBjb25zdCBkYXNoYm9hcmREYXRhID0ge1xyXG4gICAgICBlbmVyZ3lHZW5lcmF0ZWQ6IGluZGljYXRvcnM/LmZpbmQoKGkpID0+IGkubmFtZSA9PT0gXCJFbmVyZ2lhIEdlcmFkYVwiKT8uY3VycmVudF92YWx1ZSB8fCAwLFxyXG4gICAgICB3YXN0ZVByb2Nlc3NlZDogaW5kaWNhdG9ycz8uZmluZCgoaSkgPT4gaS5uYW1lID09PSBcIlJlc8OtZHVvcyBQcm9jZXNzYWRvc1wiKT8uY3VycmVudF92YWx1ZSB8fCAwLFxyXG4gICAgICB0YXhTYXZpbmdzOiBpbmRpY2F0b3JzPy5maW5kKChpKSA9PiBpLm5hbWUgPT09IFwiSW1wb3N0byBBYmF0aWRvXCIpPy5jdXJyZW50X3ZhbHVlIHx8IDAsXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGRhc2hib2FyZERhdGEpXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBkYXNoYm9hcmQgaW5kaWNhdG9yczpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggaW5kaWNhdG9yc1wiIH0sIHsgc3RhdHVzOiA1MDAgfSlcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInN1cGFiYXNlIiwiR0VUIiwiZGF0YSIsImluZGljYXRvcnMiLCJlcnJvciIsImZyb20iLCJzZWxlY3QiLCJpbiIsIm9yZGVyIiwiYXNjZW5kaW5nIiwiZGFzaGJvYXJkRGF0YSIsImVuZXJneUdlbmVyYXRlZCIsImZpbmQiLCJpIiwibmFtZSIsImN1cnJlbnRfdmFsdWUiLCJ3YXN0ZVByb2Nlc3NlZCIsInRheFNhdmluZ3MiLCJqc29uIiwiY29uc29sZSIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/dashboard/indicators/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase/client.ts":
/*!********************************!*\
  !*** ./lib/supabase/client.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   isSupabaseConfigured: () => (/* binding */ isSupabaseConfigured),\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/auth-helpers-nextjs */ \"(rsc)/./node_modules/@supabase/auth-helpers-nextjs/dist/index.js\");\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0__);\n\n// Check if Supabase environment variables are available\nconst isSupabaseConfigured =  true && \"https://scsldapnrzpjkyqkeiop.supabase.co\".length > 0 && \"string\" === \"string\" && \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjc2xkYXBucnpwamt5cWtlaW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTYyMzksImV4cCI6MjA3MTEzMjIzOX0.TxRPb6uaLdCCBdjvjKOghvaD7EBPlA2rZqTfh8gPdBw\".length > 0;\n// Create a singleton instance of the Supabase client for Client Components\nconst supabase = (0,_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0__.createClientComponentClient)();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UvY2xpZW50LnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBMkU7QUFFM0Usd0RBQXdEO0FBQ2pELE1BQU1DLHVCQUNYLEtBQXdELElBQ3hEQywwQ0FBb0MsQ0FBQ0csTUFBTSxHQUFHLEtBQzlDLFFBQWdELEtBQUssWUFDckRILGtOQUF5QyxDQUFDRyxNQUFNLEdBQUcsRUFBQztBQUV0RCwyRUFBMkU7QUFDcEUsTUFBTUUsV0FBV1AsMEZBQTJCQSxHQUFFIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEFsdW5vc1xcRG9jdW1lbnRzXFxHaXRIdWJcXHByb2pldG8tYmlvZ2VuLXYyLXJlYWN0XFxsaWJcXHN1cGFiYXNlXFxjbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50Q29tcG9uZW50Q2xpZW50IH0gZnJvbSBcIkBzdXBhYmFzZS9hdXRoLWhlbHBlcnMtbmV4dGpzXCJcclxuXHJcbi8vIENoZWNrIGlmIFN1cGFiYXNlIGVudmlyb25tZW50IHZhcmlhYmxlcyBhcmUgYXZhaWxhYmxlXHJcbmV4cG9ydCBjb25zdCBpc1N1cGFiYXNlQ29uZmlndXJlZCA9XHJcbiAgdHlwZW9mIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCA9PT0gXCJzdHJpbmdcIiAmJlxyXG4gIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTC5sZW5ndGggPiAwICYmXHJcbiAgdHlwZW9mIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZID09PSBcInN0cmluZ1wiICYmXHJcbiAgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkubGVuZ3RoID4gMFxyXG5cclxuLy8gQ3JlYXRlIGEgc2luZ2xldG9uIGluc3RhbmNlIG9mIHRoZSBTdXBhYmFzZSBjbGllbnQgZm9yIENsaWVudCBDb21wb25lbnRzXHJcbmV4cG9ydCBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudENvbXBvbmVudENsaWVudCgpXHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnRDb21wb25lbnRDbGllbnQiLCJpc1N1cGFiYXNlQ29uZmlndXJlZCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJsZW5ndGgiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSIsInN1cGFiYXNlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase/client.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdashboard%2Findicators%2Froute&page=%2Fapi%2Fdashboard%2Findicators%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Findicators%2Froute.ts&appDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdashboard%2Findicators%2Froute&page=%2Fapi%2Fdashboard%2Findicators%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Findicators%2Froute.ts&appDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Alunos_Documents_GitHub_projeto_biogen_v2_react_app_api_dashboard_indicators_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/dashboard/indicators/route.ts */ \"(rsc)/./app/api/dashboard/indicators/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/dashboard/indicators/route\",\n        pathname: \"/api/dashboard/indicators\",\n        filename: \"route\",\n        bundlePath: \"app/api/dashboard/indicators/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Alunos\\\\Documents\\\\GitHub\\\\projeto-biogen-v2-react\\\\app\\\\api\\\\dashboard\\\\indicators\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Alunos_Documents_GitHub_projeto_biogen_v2_react_app_api_dashboard_indicators_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkYXNoYm9hcmQlMkZpbmRpY2F0b3JzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZkYXNoYm9hcmQlMkZpbmRpY2F0b3JzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGZGFzaGJvYXJkJTJGaW5kaWNhdG9ycyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNBbHVub3MlNUNEb2N1bWVudHMlNUNHaXRIdWIlNUNwcm9qZXRvLWJpb2dlbi12Mi1yZWFjdCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDQWx1bm9zJTVDRG9jdW1lbnRzJTVDR2l0SHViJTVDcHJvamV0by1iaW9nZW4tdjItcmVhY3QmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3dEO0FBQ3JJO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxBbHVub3NcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxwcm9qZXRvLWJpb2dlbi12Mi1yZWFjdFxcXFxhcHBcXFxcYXBpXFxcXGRhc2hib2FyZFxcXFxpbmRpY2F0b3JzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9kYXNoYm9hcmQvaW5kaWNhdG9ycy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2Rhc2hib2FyZC9pbmRpY2F0b3JzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9kYXNoYm9hcmQvaW5kaWNhdG9ycy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXEFsdW5vc1xcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXHByb2pldG8tYmlvZ2VuLXYyLXJlYWN0XFxcXGFwcFxcXFxhcGlcXFxcZGFzaGJvYXJkXFxcXGluZGljYXRvcnNcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdashboard%2Findicators%2Froute&page=%2Fapi%2Fdashboard%2Findicators%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Findicators%2Froute.ts&appDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/set-cookie-parser","vendor-chunks/webidl-conversions","vendor-chunks/jose"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdashboard%2Findicators%2Froute&page=%2Fapi%2Fdashboard%2Findicators%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Findicators%2Froute.ts&appDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAlunos%5CDocuments%5CGitHub%5Cprojeto-biogen-v2-react&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();