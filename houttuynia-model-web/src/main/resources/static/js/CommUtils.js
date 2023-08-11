/**
 * 表单数据转json
 * @param params
 * @returns {{}}
 */
function serToJson(params) {
    let serializedData = {};
    console.log(params);
    params.forEach(function (value, key) {
        serializedData[key] = value;
    });
    return serializedData;
}