export const drawRect = (detections, ctx) => {
    detections.forEach(prediction => {
        //get prediction results
        const [x, y, width, height] = prediction['bbox'];
        let text;
        if(prediction['class'] === "cell phone") {
            text = "0xDEADBEEF\n1.34BTC\n";
        } else {
            text = prediction['class'];
        }

        // set styles 
        const color = 'purple';
        ctx.strokeStyle = color;
        ctx.font = '18px Arial';
        ctx.fillStyle = color;

        //draw rect
        ctx.beginPath();
        ctx.fillText(text, x, y);
        ctx.rect(x, y, width, height);
        ctx.stroke();
    });
}