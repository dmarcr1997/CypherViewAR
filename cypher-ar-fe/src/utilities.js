export const drawRect = (detections, ctx, account) => {
    detections.forEach(prediction => {
        //get prediction results
        const [x, y, width, height] = prediction['bbox'];
        let text;
        let text2;
        if(prediction['class'] === "cell phone" && account !== undefined) {
            text = account.acct;
            text2 = account.balance;
        } else {
            text = prediction['class'];
            text2 = `${account.balance}`;
        }

        // set styles 
        const color = 'purple';
        ctx.strokeStyle = color;
        ctx.font = '18px Arial';
        ctx.fillStyle = color;

        //draw rect
        ctx.beginPath();
        ctx.fillText(text, x, y);
        ctx.fillText(text2, x + 10, y + 10);
        ctx.rect(x, y, width, height);
        ctx.stroke();
    });
}