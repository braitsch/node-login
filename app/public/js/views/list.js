/**
 * Created with JetBrains WebStorm.
 * User: dan
 * Date: 12-7-31
 * Time: 下午1:40
 */

$(document).ready(function(){
    var logoutHelper = new DetailController();
    $('#btn-logout').click(function(){ logoutHelper.attemptLogout(); });
    $('#github-banner').css('top', '41px');
});