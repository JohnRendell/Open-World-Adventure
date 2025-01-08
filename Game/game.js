npcGreet('npcConversationDiv', 'Hi i am Bimbo, a seller of various weapons and other stuff.');

let loggedIn_playerName;

window.onload = async function(){
    const getUserToken = await fetch('/cookie/getCookie', {
        method: "POST",
        headers: {
            "Accept": "Application/json",
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({ guaranteedAccess: true })
    });

    const getUserToken_Data = await getUserToken.json();

    if(getUserToken_Data.message === 'no cookie'){
        //alert('Cookie expired');
        //window.location.href = '/lobby';
    }
}