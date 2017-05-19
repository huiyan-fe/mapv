/**
 * @author kyle / http://nikai.us/
 */

export default function (context) {
    var devicePixelRatio = window.devicePixelRatio || 1;
    context.canvas.width = context.canvas.width * devicePixelRatio;
    context.canvas.height = context.canvas.height * devicePixelRatio;
    context.canvas.style.width = context.canvas.width / devicePixelRatio + 'px';
    context.canvas.style.height = context.canvas.height / devicePixelRatio  + 'px';
    context.scale(devicePixelRatio, devicePixelRatio);
}
