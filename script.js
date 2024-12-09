const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('colorPicker');
        const canvasColor = document.getElementById('canvasColor');
        const fontSizePicker = document.getElementById('fontSizePicker');
        const clearBtn = document.getElementById('clear');
        const saveBtn = document.getElementById('save');
        const reloadBtn = document.getElementById('reload');

        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = 400;
            const lastState = localStorage.getItem('currentSignature');
            if (lastState) {
                const img = new Image();
                img.src = lastState;
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                };
            }
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        function saveCurrentState() {
            const currentState = canvas.toDataURL();
            localStorage.setItem('currentSignature', currentState);
            localStorage.setItem('lastSignature', currentState);
        }

        function draw(e) {
            if (!isDrawing) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();

            [lastX, lastY] = [x, y];
        }

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
        });

        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            saveCurrentState();
        });
        canvas.addEventListener('mouseout', () => isDrawing = false);
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        colorPicker.addEventListener('change', (e) => {
            ctx.strokeStyle = e.target.value;
        });

        canvasColor.addEventListener('change', (e) => {
            ctx.fillStyle = e.target.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveCurrentState();
        });

        fontSizePicker.addEventListener('change', (e) => {
            ctx.lineWidth = parseInt(e.target.value);
        });

        clearBtn.addEventListener('click', () => {
            saveCurrentState();
            ctx.fillStyle = canvasColor.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        saveBtn.addEventListener('click', () => {
            saveCurrentState();
            const link = document.createElement('a');
            link.download = 'signature.png';
            link.href = canvas.toDataURL();
            link.click();
        });

        reloadBtn.addEventListener('click', () => {
            const lastState = localStorage.getItem('lastSignature');
            if (lastState) {
                const img = new Image();
                img.src = lastState;
                img.onload = () => {
                    ctx.fillStyle = canvasColor.value;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    saveCurrentState();
                };
            }
        });