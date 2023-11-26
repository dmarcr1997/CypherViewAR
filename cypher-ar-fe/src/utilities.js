export const drawRect = (detections, ctx, account) => {
    detections.forEach(prediction => {
        //get prediction results
        console.log(prediction['class'], account.acct)
        const [x, y, width, height] = prediction['bbox'];
        if((prediction['class'] === "cell phone" 
            || prediction['class'] === "clock"  
            || prediction['class'] === "wine glass" 
            || prediction['class'] === "cup" 
            || prediction['class'] === "donut") && account.acct !== undefined) {
            
            let text = account.acct.slice(0, 5);
            let text2 = account.balance;
             // set styles 
            const color = 'purple';
            ctx.strokeStyle = color;
            ctx.font = '18px Arial';
            ctx.fillStyle = color;

            //draw rect
            ctx.beginPath();
            ctx.fillText(text, x, y);
            ctx.fillText(text2, x - 20, y - 20);
            ctx.rect(x, y, width, height);
            
        }
        ctx.stroke();
    });
}