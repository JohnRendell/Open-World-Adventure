window.onload = async function(){
    const deleteCookie = await fetch('/cookie/deleteCookie', {
        method: "GET",
        headers: {
            "Accept": "Application/json",
            "Content-Type": "Application/json"
        }
    });

    const deleteCookieData = await deleteCookie.json();

    if(!deleteCookieData){
        alert('failed to clear cookie');
    }
}