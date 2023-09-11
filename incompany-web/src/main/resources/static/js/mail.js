window.onload = function() {
    // 사용자명과 암호를 파라미터에서 가져옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('_user');
    const pass = urlParams.get('_pass');

    document.getElementById('rcmloginuser').value = user;
    document.getElementById('rcmloginpwd').value = pass;

    // 로그인 버튼을 클릭합니다.
    const loginBtn = document.getElementById('rcmloginsubmit');
    loginBtn.click();
};
