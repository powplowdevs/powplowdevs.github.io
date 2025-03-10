class drawUtils{
    static drawPoint(pos, rad, color){
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, rad, 0, Math.PI*2, true);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    static strokePoint(pos, rad, color){
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, rad, 0, Math.PI*2, true);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    static drawLine(startPos, endPos, color, thickness=1){
        ctx.beginPath();
        ctx.lineWidth = thickness;
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.closePath();
    }

    static drawRect(start, size, color){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.rect(start.x, start.y, size.x, size.y);
        ctx.stroke();
        ctx.closePath();
    }

    static drawText(pos, size, color, text){
        ctx.font = size+"px Arial";
        ctx.fillStyle = color;
        ctx.fillText(text, pos.x, pos.y);
    }

}