
//will set the first posibal slot of Featured, a Custom info box
function addCustomInfoBoxIfPosibal(formDataArray, headline, bodyText) {
    var didChange = false;
    var firstFeatured = GetFormField(formDataArray, "profile_showcase[]", 0); //shoud get the first Featured dropdown field
    if(firstFeatured != null){
        if(firstFeatured.value != "8"){
            firstFeatured.value = "8"; // set to Custom info box
            didChange = true;
        }

        var title = GetFormField(formDataArray, "rgShowcaseConfig[8][0][title]");
        if(title != null){
            if(title.value != headline){
                title.value = headline;
                didChange = true;
            }
        }
        var notes = GetFormField(formDataArray, "rgShowcaseConfig[8][0][notes]");
        if(notes != null){
            if(notes.value != bodyText){
                notes.value = bodyText;
                didChange = true;
            }
        }
    }
    return didChange; // only call update if there is a chance.
}
/**
 * Here is the possible fields to changes: (you need to go to "https://steamcommunity.com/profiles/xxxxx/edit/showcases", to see what is what. )
    profile_showcase[]
    rgShowcaseConfig[4][6][notes]
    profile_showcase_style_5
    rgShowcaseConfig[5][0][badgeid]
    rgShowcaseConfig[5][0][appid]
    rgShowcaseConfig[5][0][border_color]
    rgShowcaseConfig[5][1][badgeid]
    rgShowcaseConfig[5][1][appid]
    rgShowcaseConfig[5][1][border_color]
    rgShowcaseConfig[5][2][badgeid]
    rgShowcaseConfig[5][2][appid]
    rgShowcaseConfig[5][2][border_color]
    rgShowcaseConfig[5][3][badgeid]
    rgShowcaseConfig[5][3][appid]
    rgShowcaseConfig[5][3][border_color]
    rgShowcaseConfig[5][4][badgeid]
    rgShowcaseConfig[5][4][appid]
    rgShowcaseConfig[5][4][border_color]
    rgShowcaseConfig[5][5][badgeid]
    rgShowcaseConfig[5][5][appid]
    rgShowcaseConfig[5][5][border_color]
    rgShowcaseConfig[6][0][appid]
    rgShowcaseConfig[8][0][title]
    rgShowcaseConfig[8][0][notes]
    rgShowcaseConfig[9][0][accountid]
    rgShowcaseConfig[11][0][appid]
    rgShowcaseConfig[11][0][publishedfileid]
    rgShowcaseConfig[15][0][appid]
    rgShowcaseConfig[15][0][publishedfileid]
    rgShowcaseConfig[17][0][appid]
    rgShowcaseConfig[17][0][title]
    rgShowcaseConfig[17][1][appid]
    rgShowcaseConfig[17][1][title]
    rgShowcaseConfig[17][2][appid]
    rgShowcaseConfig[17][2][title]
    rgShowcaseConfig[17][3][appid]
    rgShowcaseConfig[17][3][title]
    rgShowcaseConfig[17][4][appid]
    rgShowcaseConfig[17][4][title]
    rgShowcaseConfig[17][5][appid]
    rgShowcaseConfig[17][5][title]
    rgShowcaseConfig[17][6][appid]
    rgShowcaseConfig[17][6][title]
 */