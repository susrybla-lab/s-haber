# S-Haber — yayın ve yönetim kurulumu

Bu paket, s-haber.com.tr için hazırlanan güncel site kaynaklarıdır. **Canlı siteye henüz yüklenmedi.** Haber yönetiminin çalışması için aşağıdaki Netlify ve GitHub bağlantıları bir kez kurulmalıdır.

## Hazırlananlar

- Mobil uyumlu ana sayfa, kategori ve Türkçe haber araması; açık/koyu görünüm.
- Her haber için kalıcı adres, tarih, yazar, özet ve güvenli biçimlendirilmiş metin.
- Kullanıcı adı ve şifreyle yönetim paneli: `/admin/`.
- Haber ekleme, taslak, yayınlama, düzenleme, silme ve metin önizleme.
- JPG, PNG ve WebP görsel yükleme (en fazla 3 MB).
- Anonim forma anketi; aynı tarayıcıdan tekrar oyu engelleyen kayıt.
- Site haritası, RSS, sayfa başlıkları, açıklamalar ve haber yapılandırılmış verisi.
- Künye, hata sayfası ve eski haber bağlantıları için yönlendirme.
- Dört deneme haberi taslak olarak korundu. İlk gerçek haber yayınlanana kadar ana sayfada dürüst bir boş durum görünür.
- Mevcut özel/doğum günü sayfaları ve fotoğrafları korundu.

## 1. Önce eski erişim anahtarını iptal edin

Eski `silincek/anket.html` dosyasında GitHub erişim anahtarı bulunuyordu. Yeni paketten kaldırıldı; eski sürüm ve depo geçmişi bu anahtarı hâlâ içerebilir. GitHub → Settings → Developer settings → Personal access tokens bölümünde ilgili eski anahtarı iptal edin. Anahtarı sohbet mesajına göndermeyin.

## 2. Paketi GitHub'a yükleyin

1. ZIP'i bilgisayarınızda açın.
2. [s-haber deposunu](https://github.com/susrybla-lab/s-haber) açın.
3. **Add file → Upload files** yolunu kullanın. Paketin içindeki dosya ve klasörleri deponun ana dizinine yükleyin; ZIP dosyasını tek parça olarak veya fazladan bir `s-haber-main` klasörü altında yüklemeyin.
4. Var olan dosyaların güncellenmesine izin verin. `package.json`, `package-lock.json`, `netlify.toml`, `tools`, `lib`, `netlify`, `admin`, `assets`, `haberler` ve `site.json` aynı ana dizinde bulunmalı.
5. Değişiklikleri `main` dalına kaydedin. Dosyaları yükleme işlemi bitmeden Netlify'da manuel yayın başlatmayın.

Paketin içinde gerçek şifre veya yeni GitHub anahtarı yoktur. Daha sonra oluşturacağınız `.env.local` dosyasını GitHub'a yüklemeyin. Güncel pakette bulunmayan eski `admin/config.yml` ve `silincek/oy-verenler.txt` dosyaları artık kullanılmıyor; bunları depodan kaldırabilirsiniz. `silincek/anket.html` dosyasının yeni sürümle değiştiğini özellikle kontrol edin.

## 3. Netlify projesini bağlayın

DNS kayıtları Netlify kullanımına işaret ediyor. [Netlify](https://app.netlify.com/) hesabınızda **s-haber.com.tr alan adının bağlı olduğu mevcut projeyi** açın. Yeni bir alan adı satın almanız veya DNS kayıtlarını değiştirmeniz gerekmiyor.

Proje GitHub'a bağlı değilse, mevcut projenin yayın ayarlarından `susrybla-lab/s-haber` deposunu bağlayın. Kontrol edilecek değerler:

| Ayar | Değer |
|---|---|
| Production branch | `main` |
| Base directory | Boş (deponun kökü) |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |
| Node.js | 22 veya daha yeni |

Bu ayarlar `netlify.toml` içinde hazırdır. Mevcut projede farklı ayarlar varsa yukarıdaki değerleri kullanın. Otomatik GitHub yayınları açık olmalı. **Yalnızca statik dosyaları sürükleyip yayınlamak, yönetim panelinin sunucu işlevlerini kurmaz.** GitHub bağlantılı Netlify yayını kullanın.

## 4. Yönetici hesabınızı oluşturun

Bu bilgisayarda Node.js mevcut. Paketi açtıktan sonra **YONETICI-HESABI.cmd** dosyasını çift tıklayın. Kullanıcı adınızı ve en az 12 karakterlik şifrenizi belirleyin. Şifre yazarken ekranda görünmez.

Araç şifreyi düz metin olarak saklamaz. Paket klasöründe `.env.local` adlı, hesaba özel ayar dosyası oluşturur. Dosya zaten varsa üzerine yazmaz. Yeni hesap oluşturmak veya şifre değiştirmek için önce mevcut `.env.local` dosyasını güvenli bir yere taşıyın; aracı tekrar çalıştırın ve yeni değerleri Netlify'a aktarın.

Netlify → **Project configuration → Environment variables → Add a variable → Import from a .env file** bölümünden `.env.local` dosyasını içe aktarın. Değerler üretim ortamına uygulanmalı ve **Functions** kapsamını içermeli. Kullanıcı adınız, şifre özetiniz ve oturum anahtarınız bu şekilde sunucuya aktarılır. [Netlify ortam değişkenleri](https://docs.netlify.com/build/environment-variables/get-started/) ve [Functions kapsamı](https://docs.netlify.com/build/functions/environment-variables/).

## 5. Panelin haberleri kaydedebilmesi için GitHub bağlantısını kurun

GitHub hesabınızda yeni bir **fine-grained personal access token** oluşturun:

- Repository access: yalnızca `s-haber` deposu.
- Repository permissions → **Contents: Read and write**.
- Süre sonunu takviminize not edin. Anahtar sona erdiğinde yenisini Netlify'a girmeniz gerekir.
- Depo bir kuruluşa aitse kuruluş onayı gerekebilir.

[GitHub anahtar oluşturma kılavuzu](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) · [GitHub izinleri](https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens).

Yeni anahtarı **yalnızca Netlify ortam değişkenlerine** `GITHUB_TOKEN` adıyla ekleyin. İstemci dosyalarına veya GitHub'a yazmayın. Son durumda şu altı değişken bulunmalı:

| Değişken | Değerin kaynağı |
|---|---|
| `ADMIN_USERNAME` | Hesap oluşturma aracında seçtiğiniz kullanıcı adı |
| `ADMIN_PASSWORD_HASH` | Aracın `.env.local` içine yazdığı şifre özeti |
| `SESSION_SECRET` | Aracın oluşturduğu rastgele oturum anahtarı |
| `GITHUB_TOKEN` | Yeni oluşturduğunuz, yalnızca bu depoya yetkili anahtar |
| `GITHUB_REPOSITORY` | `susrybla-lab/s-haber` |
| `GITHUB_BRANCH` | `main` |

Ana dal doğrudan yazmaya kapalıysa panel kaydedemez. Bu sürüm, tek editörün doğrudan `main` dalına haber kaydettiği iş akışına göre hazırlandı. Taslaklar web sitesinin yayın klasörüne dahil edilmez; **GitHub deponuz herkese açıksa taslak dosyaları GitHub üzerinden okunabilir.** Yayın öncesi gizlilik gerekiyorsa depoyu özel kullanın ve Netlify bağlantısının buna yetkili olduğunu doğrulayın.

## 6. Yayınlayın ve hesabı deneyin

Netlify'da **Deploys → Trigger deploy** ile yeni yayın başlatın. Başarılı olduğunu gördükten sonra:

1. `https://s-haber.com.tr/admin/` adresini açın; belirlediğiniz kullanıcı adı ve şifreyle giriş yapın.
2. Yeni bir haber oluşturup **Taslak kaydet** seçin. Panelde taslak görünmeli, ana sayfada görünmemeli.
3. Haberi açın, bir görsel yükleyin, metni önizleyin ve **Yayınla** seçin.
4. GitHub kaydı Netlify'da yeni yayın başlatır. Yayın tamamlandıktan sonra haber ana sayfada ve kendi adresinde görünmeli. Kaydetmek ile canlıda görünmek arasında yayın süresi kadar gecikme vardır.
5. Haber aramasını, kategoriyi ve telefondaki görünümü deneyin.
6. Anketi açın, oy verin ve sayfayı yenileyin. Oy korunmalı, aynı tarayıcıdan tekrar oy engellenmeli.
7. Yönetimden çıkın; panelin giriş istediğini doğrulayın.

Anket Netlify Blobs kullanır; eski güvensiz anketteki oyları içe aktarmaz. Yeni oylama sıfırdan başlar. Çerezin silinmesi veya başka tarayıcı kullanılması yeniden oy vermeye olanak sağlar; bu bir kimlik doğrulamalı seçim sistemi değildir. [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/).

## Künye ve iletişim için kalan bilgiler

Elimizde yalnızca Genel Yayın Yönetmeni **İdris Samet Eker** bilgisi vardı. Yayıncı ünvanı, iletişim e-postası, telefon ve adres uydurulmadı. Bu bilgileri `site.json` içindeki `publisher`, `email`, `phone`, `address` alanlarına girin; yeni yayında künye sayfasına eklenir. Alan adı değişirse `url` alanını da güncelleyin.

Mevcut kişisel sürpriz sayfasındaki kod ekranı gerçek erişim güvenliği sağlamaz; bu sayfalar eski hâliyle korundu. Yönetici paneli bundan bağımsız, sunucu tarafından doğrulanan giriş kullanır.

## Yapılan doğrulamalar ve sınırlar

13 otomatik test geçti: şifre doğrulama, oturum imzası/zaman aşımı, izinsiz erişim, başka siteden yazma isteği, güvenli metin işleme, Türkçe içerik, haber kaydetme/güncelleme/silme/çakışma, görsel tür kontrolü, tekrar oy engeli, taslakların yayın çıktısından dışlanması ve eski haber sayfalarının temizlenmesi. Paket oluşturma başarılı; bağımlılık denetimi bilinen açık bildirmedi.

GitHub ve anket testlerinde deneme bağlantıları kullanıldı. Gerçek hesabınıza yazma, Netlify sunucu yayını, HTTPS çerezi ve tarayıcı görünüm testi canlı ortamda henüz doğrulanmadı. Yönetici bilgileri ve GitHub anahtarı bu oturumda girilmedi; GitHub'a yükleme veya canlı yayın yapılmadı. Bu nedenle hesap kurulumu tamamlanmadan siteyi tamamen canlıya hazır kabul etmeyin.

## Sorun giderme

| Sorun | Kontrol |
|---|---|
| “Yönetici hesabı henüz yapılandırılmamış” | Üç yönetici değişkeni, Functions kapsamı ve yeni yayın |
| “GitHub bağlantısı yapılandırılmamış” | `GITHUB_TOKEN`, depo adı ve anahtarın süresi |
| “GitHub bağlantısı tamamlanamadı” | Contents yazma izni, kuruluş onayı ve dal koruması |
| Haber kaydedildi ama görünmüyor | Taslak durumu, yayın tarihi ve Netlify yayınının sonucu |
| “Haber başka bir işlemde değişti” | Haberi yeniden açın; son sürüm üzerinde düzenleyin |
| Görsel yüklenmiyor | JPG/PNG/WebP ve 3 MB sınırı |
| Anket açılamıyor | `SESSION_SECRET`, Netlify Blobs ve sunucu günlükleri |
| Çok fazla giriş denemesi | Bir dakika bekleyin; giriş hız sınırı uygulanır |

Giriş ve anket için iki adet Netlify hız sınırlama kuralı tanımlandı. [Netlify hız sınırlama belgeleri](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/).

Geliştirici kontrolü için: `npm ci`, `npm test`, `npm run build`. Yerel sayfa önizlemesi: `npm run dev`. Yerel önizleme sunucusu gerçek GitHub veya anket hizmetini taklit etmez; yalnızca sayfaları sunar.
