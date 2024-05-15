// public/service-worker.js
self.addEventListener('push', function(event) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
    });
});

// serviceworker 등록 및 푸시 구독 설정
fetch('/api/vapidPublicKey').then(response => response.text()).then(vapidPublicKey => {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        }).then(function(subscription) {
            const userId = localStorage.getItem('userId'); // local storage에서 ID 가져오기
            if (!userId) {
                console.error('User ID is missing in local storage');
                return;
            }
            // 서버에 subscription 정보 저장
            fetch('/api/save-subscription', {
                method: 'POST',
                body: JSON.stringify({
                    userId: userId,
                    subscription: subscription
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        });
    }).catch(function(error) {
        console.error('Service Worker registration failed:', error);
    });
}).catch(error => {
    console.error('Failed to fetch VAPID public key:', error);
});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
