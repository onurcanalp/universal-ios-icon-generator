/** 
 * IOS Icon Generator
 * iTunesArtwork(1024x1024) dan Universal (IPhone + IPad) icon size oluşturma
 * 
 * XCode 8.2.1 ve IOS 10.2 sürümünde ihtiyacınız olan tüm boyutları ayrı ayrı isimleri ile oluşturur
 * Dosya isimlerine baktığınız zaman kolaylıkla hangi icon yerine geldiğini anlayabilirsiniz.
 *
 * Bu dosyayı PS ile birlikte açarsanız otomatik olarak çalışacaktır.
 * Bir diğer yolu /Applications/Utilities/Adobe Utilities/ExtendScript Toolkit CS5/SDK dizini altına atıp 
 * scripti PS içinden çalşıtırmak ama ben bir önceki bahsettiğim yöntemi tercih ediyorum.
 *
 * Herkese kolay gelsin..
 */


try
{
  var iTunesArtwork = File.openDialog("1024x1024 PNG Resim Seçiniz.", "*.png", false);

  if (iTunesArtwork !== null) 
  { 
    var doc = open(iTunesArtwork, OpenDocumentType.PNG);
    
    if (doc == null)
    {
      throw "Hata oluştu. PNG dosyasının düzgün olduğundan emin olun.";
    }

    var startState = doc.activeHistoryState; 
    var initialPrefs = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;

    if (doc.width != doc.height)
    {
        throw "Resim Kare Değil";
    }
    else if ((doc.width < 1024) && (doc.height < 1024))
    {
        throw "Resim Gerekli büyüklükte değil! 1024x1024 px olmak zorunda!";
    }
    else if (doc.width < 1024)
    {
        throw "Resim genişliği 1024 den küçük olamaz!";
    }
    else if (doc.height < 1024)
    {
        throw "Resim yüksekliği 1024 den küçük olamaz.";
    }
    
    // Hedef Dizin
    var destFolder = Folder.selectDialog( "Çıktıların kaydedileceği dizini seçiniz..");

    if (destFolder == null)
    {
      // Kullanıcı iptal etti, çıkış!
      throw "";
    }

    // PNG
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = false; // PNG-24
    sfw.transparency = true;
    doc.info = null;  // metadata temizlemece
    
    //itunes da gereken boyutlar
    var icons = [
      {"name": "iTunesArtwork@2x", "size":1024},
      {"name": "iTunesArtwork",    "size":512},
      {"name": "Iphone-notification_20@2x", "size":40},
      {"name": "Iphone-notification_20@3x", "size":60},
      {"name": "Iphone-spotlight_29@2x", "size":58},
      {"name": "Iphone-spotlight_29@3x", "size":87},
      {"name": "Iphone-spotlight_40@2x", "size":80},
      {"name": "Iphone-spotlight_40@3x", "size":120},
      {"name": "Iphone_60@2x", "size":120},
      {"name": "Iphone_60@3x", "size":180},
      {"name": "Ipad-notification_20", "size":20},
      {"name": "Ipad-notification_20@2", "size":40},
      {"name": "Ipad-settings_29",       "size":29},
      {"name": "Ipad-settings_29@2x",    "size":58},
      {"name": "Ipad-spotlight_40", "size":40},
      {"name": "Ipad-spotlight_40@2x", "size":80},
      {"name": "Ipad_76",          "size":76},
      {"name": "Ipad_76@2x",          "size":152},
      {"name": "IpadPro_835@2x",          "size":167},
    ];

    var icon;
    for (i = 0; i < icons.length; i++) 
    {
      icon = icons[i];
      doc.resizeImage(icon.size, icon.size, // width, height
                      null, ResampleMethod.BICUBICSHARPER);

      var destFileName = icon.name + ".png";

      if ((icon.name == "iTunesArtwork@2x") || (icon.name == "iTunesArtwork"))
      {
        // iTunesArtwork uzantısız olacak
        destFileName = icon.name;
      }

      doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // resize işlemini geri alalım
    }

    alert("İşleminiz tamamlandı, dosyalarınıza seçtiğiniz dizinden ulaşabilirsiniz!");
  }
}
catch (exception)
{
  // Show degbug message and then quit
	if ((exception != null) && (exception != ""))
    alert(exception);
 }
finally
{
    if (doc != null)
        doc.close(SaveOptions.DONOTSAVECHANGES);
  
    app.preferences.rulerUnits = initialPrefs; // Varsayılan ayarlara dönelim
}