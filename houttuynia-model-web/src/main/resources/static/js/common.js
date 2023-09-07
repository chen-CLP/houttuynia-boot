/**
 * 打开图标选择界面
 */
function openIconsHtml(id) {
    layer.open({
        type: 2,
        title: '图标列表',
        content: [`/system/public/icons?id=${id}`, 'yes'],
        area: ['480px', '90%'],
    });
}

/**
 * 图标选择回调函数
 *
 * @param icon
 */
function setIconVal(icon, elementId) {
    $(`#${elementId}`).val(icon);
}