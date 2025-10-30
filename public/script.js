// 1. FORMA YUBORISH
document.getElementById('prayerForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Formani yubormaslik
    
    // 2. TUGMANI BLOKLAYMIZ
    const button = e.target.querySelector('button');
    const resultDiv = document.getElementById('result');
    
    button.disabled = true;
    button.textContent = 'Yuborilmoqda...';
    
    // 3. MA'LUMOTLARNI YIG'AMIZ
    const times = {
        bomdod: document.getElementById('bomdod').value,
        quyosh: document.getElementById('quyosh').value,
        peshin: document.getElementById('peshin').value,
        asr: document.getElementById('asr').value,
        shom: document.getElementById('shom').value,
        xufton: document.getElementById('xufton').value
    };
    
    try {
        // 4. SERVERGA YUBORAMIZ
        const response = await fetch('/submit-times', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(times)
        });
        
        const data = await response.json();
        
        // 5. NATIJANI KO'RSATAMIZ
        if (data.success) {
            resultDiv.className = 'result success';
            resultDiv.textContent = data.message;
            
            // Formani tozalash
            document.getElementById('prayerForm').reset();
        } else {
            resultDiv.className = 'result error';
            resultDiv.textContent = data.message;
        }
        
    } catch (error) {
        // 6. XATOLIKNI KO'RSATAMIZ
        resultDiv.className = 'result error';
        resultDiv.textContent = '❌ Internet aloqasini tekshiring';
    } finally {
        // 7. TUGMANI QAYTA YOQAMIZ
        button.disabled = false;
        button.textContent = '📤 Kanalga Joylash';
    }
});
