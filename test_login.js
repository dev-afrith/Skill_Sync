fetch('http://localhost:4000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'afrith.student@skillsync.com',
        password: 'password123'
    })
}).then(res => res.text()).then(data => {
    console.log('Login Response:', data.slice(0, 500));
}).catch(console.error);
