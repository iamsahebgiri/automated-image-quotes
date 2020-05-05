const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

if(Cookies.get('count'))
{
    Cookies.set('count',eval(Cookies.get('count')+'+1'));
}
else{
    Cookies.set('count',1);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function getQuote() {
    fetch('https://quote-garden.herokuapp.com/quotes/random')
        .then(res => res.json())
        .then(res => {
            const canvasHeight = canvas.height;
            const lineHeight = 60;
            const lineCount = Math.floor(ctx.measureText(res.quoteText).width / 100);
            const y = (canvasHeight - (lineHeight * lineCount)) / 2;

            console.log(res.quoteText);

            ctx.font = '60px Roboto Mono';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';

            wrapText(ctx, res.quoteText, canvas.width / 2, y, 880, lineHeight);
            const link = document.getElementById('link');
            let filename = Cookies.get('count');
            link.setAttribute('download', `QH_2020_04_${filename}.png`);

            link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
            link.click();
        });
}

function getImage() {
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
    };
    img.src = './assets/QHTemplate.png';
}
getImage();
getQuote();

