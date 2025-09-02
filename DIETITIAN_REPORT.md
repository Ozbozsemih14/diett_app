# AI Diet Assistant - Diyetisyen Değerlendirme Raporu

## 📋 Proje Özeti
AI destekli beslenme ve diyet takip uygulaması. Kullanıcıların kişiselleştirilmiş diyet planları oluşturmasına ve beslenme alışkanlıklarını takip etmesine yardımcı olur.

---

## 🍽️ Beslenme ve Diyet Özellikleri

### ✅ Mevcut Özellikler

#### **1. Kullanıcı Profili ve Kişiselleştirme**
- **Demografik Bilgiler:** Yaş, cinsiyet, boy, kilo
- **Aktivite Seviyesi:** Sedanter, hafif aktif, orta aktif, aktif, çok aktif
- **Sağlık Hedefleri:** Kilo verme, kilo alma, mevcut kilodu koruma
- **Sağlık Durumları:** Diyabet, hipertansiyon, kalp hastalığı vs.
- **Diyet Kısıtlamaları:** Alerjiler, vegetaryenlik, vejanlık vs.

#### **2. Kalori ve Makro Besin Hesaplama**
- **BMR Hesaplama:** Harris-Benedict formülü kullanılarak
- **Günlük Kalori Hedefi:** BMR × Aktivite çarpanı × Hedef ayarı
- **Hedef Ayarları:** 
  - Kilo verme: -20% kalori
  - Koruma: Normal kalori
  - Kilo alma: +20% kalori

#### **3. Makro Besin Dağılımı**
- **Varsayılan Oranlar:** Protein %30, Karbonhidrat %45, Yağ %25
- **Ayarlanabilir Sliderlar:** Her makro için %10-60 arasında
- **Otomatik Rebalans:** Bir makro değiştiğinde diğerleri otomatik ayarlanır
- **Gram Hesaplama:** 
  - Protein: 4 kal/gram
  - Karbonhidrat: 4 kal/gram
  - Yağ: 9 kal/gram

#### **4. Diyet Planı Oluşturma**
- **Gerçek Besin Değerleri:** CSV veritabanından gerçek kalori/makro değerleri
- **15+ Farklı Besin:** Tavuk, somon, yumurta, yulaf, kinoa vs.
- **3 Öğün:** Kahvaltı, öğle, akşam yemeği
- **Çeşitlilik:** Her öğün için 3 farklı alternatif, rastgele rotasyon
- **Otomatik Alışveriş Listesi:** Seçilen yemeklere göre malzeme listesi

#### **5. Beslenme Takibi**
- **Günlük Progress:** Kalori, protein, karbonhidrat takibi
- **Gerçek Zamanlı:** Yemek tüketimi ile anında güncellenen progress barları
- **Hedef vs Gerçek:** Tüketilen vs hedeflenen besin karşılaştırması

#### **6. Su Tüketimi**
- **Kişiselleştirilmiş Hesaplama:** 35ml/kg vücut ağırlığı + aktivite çarpanı
- **Pratik Gösterim:** ml ve bardak cinsinden (250ml/bardak)
- **Progress Tracking:** Günlük su tüketimi takibi

---

## 📊 Teknik Altyapı

### **Besin Veritabanı (food_database.csv)**
```
- Rice: 130 kal/100g, 2.7g protein, 28.2g karb, 0.3g yağ
- Chicken Breast: 165 kal/100g, 31g protein, 0g karb, 3.6g yağ
- Salmon: 208 kal/100g, 25g protein, 0g karb, 11g yağ
- Oats: 389 kal/100g, 16.9g protein, 66.3g karb, 6.9g yağ
- Quinoa: 368 kal/100g, 14g protein, 64g karb, 6g yağ
... 20+ besin maddesi
```

### **Örnek Meal Alternatifleri**
**Kahvaltı:**
- Yulaf + Muz + Badem (194 + 89 + 174 = 457 kal)
- Yoğurt + Muz + Badem (146 + 89 + 174 = 409 kal)
- Yumurta + Avokado + Zeytinyağı (155 + 160 + 119 = 434 kal)

**Öğle:**
- Tavuk + Kinoa + Brokoli (248 + 184 + 34 = 466 kal)
- Tavuk + Esmer Pirinç + Karışık Sebze (248 + 111 + 35 = 394 kal)

---

## ⚠️ Geliştirilebilir Alanlar

### **1. Besin Veritabanı**
- **Mevcut:** 20+ besin maddesi
- **Öneri:** 500+ besin maddesi eklenmeli
- **Eksik:** Türk mutfağı ağırlıklı yemekler
- **Öneri:** Dolma, köfte, pilav, çorba gibi geleneksel yemekler

### **2. Porsiyon Kontrolü**
- **Mevcut:** Sabit porsiyon miktarları (150g tavuk vs)
- **Öneri:** Kullanıcı ihtiyacına göre dinamik porsiyon hesaplama
- **Eksik:** Görsel porsiyon rehberi

### **3. Mikro Besinler**
- **Mevcut:** Sadece makro besinler (protein, karb, yağ)
- **Öneri:** Vitamin ve mineral takibi
- **Eksik:** B12, D vitamini, demir, kalsiyum vs.

### **4. Özel Diyetler**
- **Mevcut:** Genel makro dağılımı
- **Öneri:** Ketojenik, Mediterranean, DASH diyet planları
- **Eksik:** Diyabetik, hipertansif hastalara özel planlar

### **5. Besin Değeri Doğruluğu**
- **Mevcut:** Genel ortalama değerler
- **Öneri:** Marka bazlı, pişirme yöntemi bazlı değerler
- **Eksik:** Çiğ vs pişmiş besin değeri farkları

### **6. Glisemik İndeks**
- **Eksik:** Karbonhidratların glisemik indeks bilgisi
- **Öneri:** Diyabetik kullanıcılar için önemli

### **7. Alerjen Takibi**
- **Mevcut:** Genel alerji seçimi
- **Öneri:** Detaylı alerjen analizi (gluten, laktoz, vs)

---

## 🎯 Diyetisyen İçin Öneriler

### **Değerlendirilmesi Gereken Sorular:**

1. **Makro Dağılım Oranları Doğru mu?**
   - Protein %30, Karb %45, Yağ %25 oranları uygun mu?
   - Farklı hedefler için farklı oranlar olmalı mı?

2. **BMR Hesaplama Yöntemi:**
   - Harris-Benedict formülü yeterli mi?
   - Mifflin-St Jeor daha mı doğru?

3. **Kalori Ayarları:**
   - Kilo verme için -20% yeterli mi?
   - Daha gradual yaklaşım (-10%) daha mı sağlıklı?

4. **Su İhtiyacı Hesaplaması:**
   - 35ml/kg formülü doğru mu?
   - Yaş, iklim, sağlık durumu faktörleri?

5. **Besin Kombinasyonları:**
   - Önerilen yemek kombinasyonları beslenme açısından dengeli mi?
   - Amino asit profili, vitamin emilimi göz önünde bulundurulmuş mu?

### **Geliştirme Önerileri:**

1. **Kademeli Hedefler:** Ani kalori kısıtlaması yerine kademeli geçiş
2. **Kişisel Sağlık Durumu:** Daha detaylı sağlık durumu bazlı öneriler
3. **Beslenme Eğitimi:** Kullanıcıya beslenme bilgisi verme modülü
4. **Uzman Onayı:** Diyetisyen onaylı meal plan şablonları

---

## 📈 Teknik Detaylar

### **Kullanılan Formüller:**
- **BMR (Erkek):** 88.362 + (13.397 × kilo) + (4.799 × boy) - (5.677 × yaş)
- **BMR (Kadın):** 447.593 + (9.247 × kilo) + (3.098 × boy) - (4.330 × yaş)
- **Günlük Kalori:** BMR × Aktivite Çarpanı × Hedef Çarpanı
- **Su İhtiyacı:** Kilo × 35ml × Aktivite Çarpanı

### **Mevcut Besin Değerleri Örneği:**
```javascript
FOOD_DATABASE = {
  chicken_breast: { calories: 248, protein: 46.5, carbs: 0, fat: 5.4, portion: 150g },
  salmon: { calories: 312, protein: 37.5, carbs: 0, fat: 16.5, portion: 150g },
  oats: { calories: 194, protein: 8.5, carbs: 33.2, fat: 3.5, portion: 50g }
}
```

---

## 💡 Son Notlar

Bu uygulama temel beslenme takibi için iyi bir başlangıç noktası. Ancak tıbbi tavsiye veya profesyonel diyet danışmanlığının yerini tutmaz. Diyetisyen değerlendirmesi ile daha güvenli ve etkili hale getirilebilir.

**Acil Düzeltilmesi Gerekenler:**
- [ ] Mikro besin eksikliği uyarısı
- [ ] Aşırı kısıtlayıcı diyet uyarısı  
- [ ] Sağlık durumu bazlı contraindication'lar

**Uzun Vadeli Geliştirmeler:**
- [ ] Diyetisyen onaylı meal template'leri
- [ ] Biyometrik takip entegrasyonu
- [ ] Beslenme eğitimi modülü