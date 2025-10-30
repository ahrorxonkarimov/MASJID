// Form yuborish
document.getElementById('prayerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const button = e.target.querySelector('button');
    const resultDiv = document.getElementById('result');
    
    button.disabled = true;
    button.textContent = 'Yuborilmoqda...';
    
    const times = {
        bomdod: document.getElementById('bomdod').value,
        quyosh: document.getElementById('quyosh').value,
        peshin: document.getElementById('peshin').value,
        asr: document.getElementById('asr').value,
        shom: document.getElementById('shom').value,
        xufton: document.getElementById('xufton').value
    };
    
    try {
        const response = await fetch('/submit-times', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(times)
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultDiv.className = 'result success';
            resultDiv.textContent = data.message;
            document.getElementById('prayerForm').reset();
        } else {
            resultDiv.className = 'result error';
            resultDiv.textContent = data.message;
        }
        
    } catch (error) {
        resultDiv.className = 'result error';
        resultDiv.textContent = '❌ Internet aloqasini tekshiring';
    } finally {
        button.disabled = false;
        button.textContent = '📤 Kanalga Joylash';
    }
});
