const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (event) => {
    event.preventDefault();
    const emp_id = loginForm.emp_id.value;
    const password = loginForm.password.value;
    console.log(emp_id, password)

    fetch('/login', {
        method:'post',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
            emp_id: emp_id,
            password: password,
        })})
        .then(res => res.json())
        .then(res => {
            console.log(res.err)
            if (res.err == 1) loginErrorMsg.style.opacity = 1
            else {
                alert("You have successfully logged in.")
                location.href = '/bin'
            }
        })
});