window.onload = async function(){
    const deleteCookie: Response = await fetch('/cookie/deleteCookie', {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });

    const deleteCookieData = await deleteCookie.json();

    if(!deleteCookieData){
        alert('failed to clear cookie');
    }
}