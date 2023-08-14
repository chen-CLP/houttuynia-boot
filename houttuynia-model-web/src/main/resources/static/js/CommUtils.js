/**
 * 表单数据转json
 * @param params
 * @returns {{}}
 */
function serToJson(params) {
    let serializedData = {};
    params.forEach(function (value, key) {
        serializedData[key] = value;
    });
    return serializedData;
}