import React, {useCallback, useState} from 'react';

function App() {
    const [iframeSrc, setIframeSrc] = useState<string>();
    const [ssoChecked, setSsoChecked] = useState(false);
    const [authToken, setAuthToken] = useState<string>();

    const messageHandler = useCallback((event: MessageEvent) => {
        if (event.data.action) {
            switch (event.data.action) {
                case 'Authorized':
                    if (event.data.payload && event.data.payload.token) {
                        setAuthToken(event.data.payload.token);
                    } else {
                        setAuthToken(undefined);
                    }
                    setSsoChecked(true);
                    break;

                case 'Registered':
                    setIframeSrc(undefined);
                    break;
            }
        }
    }, []);

    React.useEffect(() => {
        window.addEventListener('message', messageHandler);
        return () => {
            window.removeEventListener('message', messageHandler);
        };
    }, [messageHandler]);

    if (!ssoChecked) {
        return (
            <iframe
                src="http://account.com/auth/sso?service=app1.com"
                style={{border: 'none', height: 0}}
            />
        );
    }

    return (
        <div>
            {authToken && <div>Authorized: token = {authToken}. <a href="#">Logout</a></div>}
            {!authToken && (
                <div>
                    <button
                        onClick={() => setIframeSrc('http://account.com/register?service=app1.com')}
                    >
                        Register
                    </button>
                    <button
                        onClick={() =>
                            setIframeSrc('http://account.com/auth/login?service=app1.com')
                        }
                    >
                        Login
                    </button>
                </div>
            )}
            {!authToken && <iframe src={iframeSrc} style={{border: 'none', width: '100%'}} />}
        </div>
    );
}

export default App;
