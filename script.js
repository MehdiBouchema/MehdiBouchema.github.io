function checkPassword()
{
    //neem ingegeven wachtwoord
    var password = document.getElementById("givenPass").value;
   
    //SHA-1 hashen om het dan naar HIBP te sturen
    var hashedPass = CryptoJS.SHA1(password);
    
    //gehashte wachtwoord omzetten naar Hexadecimaal voor latere vergelijking van api response
    var hexaPass = hashedPass.toString(CryptoJS.enc.Hex);
    
    //GET request naar pwned API moet EERSTE 5 characters hebben, later in gebruik
    var shortHexaPass = hexaPass.substring(0,5);
        
    //Pak alles na 5 eerste characters voor Hexa vergelijking met pwned RESPONSE
    var slicedHexaPass = hexaPass.slice(5);

    //Om vergelijkingen die later gebeuren met de Hexa's zonder problemen te laten gebeuren zorgen we voor consistentie van de letters (stringvergelijkingen)
    slicedHexaPass = slicedHexaPass.toUpperCase();
    
    // GET https://api.pwnedpasswords.com/range/{first 5 hash chars}
    const https = new XMLHttpRequest;
    const url = 'https://api.pwnedpasswords.com/range/' + shortHexaPass;
    
    https.open("get", url);
    https.send();
    https.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200)
        {
            // Gezocht om de gevonden Hexa's mooi te ordenen voor te loopen nadien
            httpResponse = this.responseText.split('\n');
            
            // Zoek de corresponderende sliced in de API response
            for(i in httpResponse){
                if(httpResponse[i].includes(slicedHexaPass)){
                   
                    // Hier een corresponderend Hexa gevonden uit de pwned API, deze slicen om achteraan het aantal vast te hebben (achter de ":")
                    var matchedHexa = httpResponse[i].slice(36);
                    break;
                }
            }
            //Match gevonden, nu checken of meer dan 300x gebruikt -> geweigerd
            if(matchedHexa > 300){
                alert("Wachtwoord geweigerd! Komt " + matchedHexa + " keer voor, wat MEER is dan de norm van 300. Kies een nieuw wachtwoord.");
            }
            else {
                alert("Wachtwoord geaccepteerd! Komt " + matchedHexa + " keer voor, wat MINDER is dan de norm van 300.");
            }
        }
    }
}