/**
 * PhoneStoreSync - Hệ thống đồng bộ dữ liệu tập trung giữa Khách Mua Hàng & Quản Trị Admin
 * Xử lý: Tự động trừ tồn kho và cộng doanh thu vào đúng hãng (Apple, Xiaomi, Vivo) khi phát sinh đơn hàng
 */
(function() {
  const DEFAULT_PRODUCTS = [
    { id: 'AP-01', name: 'iPhone 16 Pro Max 512GB', brand: 'Apple', price: 34990000, stock: 45, sold: 128 },
    { id: 'AP-02', name: 'iPhone 15 Pro Max 256GB', brand: 'Apple', price: 29990000, stock: 24, sold: 86 },
    { id: 'AP-03', name: 'iPhone 13 128GB Chính Hãng', brand: 'Apple', price: 13890000, stock: 58, sold: 210 },
    { id: 'AP-04', name: 'iPhone 16 128GB', brand: 'Apple', price: 21950000, stock: 30, sold: 92 },
    { id: 'XM-01', name: 'Xiaomi 15 Pro (Snapdragon 8 Elite)', brand: 'Xiaomi', price: 18450000, stock: 32, sold: 95 },
    { id: 'XM-02', name: 'Xiaomi 14 Ultra 512GB', brand: 'Xiaomi', price: 27490000, stock: 16, sold: 74 },
    { id: 'XM-03', name: 'Redmi Note 13 Pro 256GB', brand: 'Xiaomi', price: 5690000, stock: 110, sold: 340 },
    { id: 'VV-01', name: 'Vivo X300 Ultra 5G', brand: 'Vivo', price: 24990000, stock: 20, sold: 52 },
    { id: 'VV-02', name: 'Vivo X100 Pro 5G', brand: 'Vivo', price: 19990000, stock: 18, sold: 63 },
    { id: 'VV-03', name: 'Vivo X200 5G 256GB', brand: 'Vivo', price: 14950000, stock: 28, sold: 70 },
    { id: 'VV-04', name: 'Vivo V30 5G 256GB', brand: 'Vivo', price: 12490000, stock: 35, sold: 115 },
  ];

  const DEFAULT_BRAND_REVENUE = {
    Apple: 1250000000,
    Xiaomi: 680000000,
    Vivo: 420000000,
    total: 2350000000
  };

  const DEFAULT_ORDERS = [
    { id: '#DH-101', customerName: 'Đặng Thị Như Đào', phone: '0987654321', province: 'Thanh Hóa', district: 'TP. Thanh Hóa', address: 'Số 48 Lê Lợi, Phường Lam Sơn, TP. Thanh Hóa, Thanh Hóa', brand: 'Apple', product: 'iPhone 16 Pro Max 512GB', quantity: 1, total: 34990000, deposit: 5000000, type: 'PreOrder', status: 'preorder', date: '2026-09-20', staff: 'Nguyễn Văn C' },
    { id: '#DH-102', customerName: 'Nguyễn Văn An', phone: '0912345678', province: 'Hà Nội', district: 'Cầu Giấy', address: 'Số 12 Ngõ 68 Xuân Thủy, Cầu Giấy, Hà Nội', brand: 'Xiaomi', product: 'Xiaomi 15 Pro (Snapdragon 8 Elite)', quantity: 1, total: 18450000, deposit: 0, type: 'Standard', status: 'completed', date: '2026-09-20', staff: 'Trần Thị H' },
    { id: '#DH-103', customerName: 'Lê Hoàng Nam', phone: '0933111222', province: 'Thái Bình', district: 'Vũ Thư', address: 'Số 89 Đường Trần Hưng Đạo, Vũ Thư, Thái Bình', brand: 'Vivo', product: 'Vivo X300 Ultra 5G', quantity: 1, total: 24990000, deposit: 2000000, type: 'PreOrder', status: 'shipping', date: '2026-09-20', staff: 'Lê Văn N' },
    { id: '#DH-104', customerName: 'Phạm Thanh Hương', phone: '0978999888', province: 'TP. Hồ Chí Minh', district: 'Quận 1', address: 'Số 120 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh', brand: 'Apple', product: 'iPhone 15 Pro Max 256GB', quantity: 1, total: 29990000, deposit: 0, type: 'Standard', status: 'completed', date: '2026-09-19', staff: 'Phạm Thị A' },
    { id: '#DH-105', customerName: 'Trần Minh Quân', phone: '0905123456', province: 'Đà Nẵng', district: 'Hải Châu', address: 'Số 35 Bạch Đằng, P. Thạch Thang, Hải Châu, Đà Nẵng', brand: 'Xiaomi', product: 'Xiaomi 14 Ultra 512GB', quantity: 1, total: 27490000, deposit: 0, type: 'Standard', status: 'pending', date: '2026-09-21', staff: 'Nguyễn Văn C' },
    { id: '#DH-106', customerName: 'Vũ Đức Thành', phone: '0945678901', province: 'Hải Phòng', district: 'Lê Chân', address: 'Số 15 Cầu Đất, P. Cầu Đất, Lê Chân, Hải Phòng', brand: 'Vivo', product: 'Vivo V30 5G 256GB', quantity: 2, total: 24980000, deposit: 0, type: 'Standard', status: 'completed', date: '2026-09-21', staff: 'Trần Thị H' },
    { id: '#DH-107', customerName: 'Hoàng Mai Phương', phone: '0966333444', province: 'Hà Nội', district: 'Đống Đa', address: 'Số 74 Chùa Bộc, P. Quang Trung, Đống Đa, Hà Nội', brand: 'Apple', product: 'iPhone 13 128GB Chính Hãng', quantity: 1, total: 13890000, deposit: 0, type: 'Standard', status: 'completed', date: '2026-09-18', staff: 'Phạm Thị A' },
    { id: '#DH-108', customerName: 'Đỗ Tiến Đạt', phone: '0918777666', province: 'Bình Dương', district: 'Thủ Dầu Một', address: 'Số 204 Đại lộ Bình Dương, P. Phú Hòa, Thủ Dầu Một, Bình Dương', brand: 'Xiaomi', product: 'Redmi Note 13 Pro 256GB', quantity: 3, total: 17070000, deposit: 0, type: 'Standard', status: 'shipping', date: '2026-09-18', staff: 'Lê Văn N' },
    { id: '#DH-109', customerName: 'Bùi Thị Tuyết', phone: '0938222111', province: 'Cần Thơ', district: 'Ninh Kiều', address: 'Số 52 Đường 30/4, P. An Phú, Ninh Kiều, Cần Thơ', brand: 'Vivo', product: 'Vivo X100 Pro 5G', quantity: 1, total: 19990000, deposit: 0, type: 'Standard', status: 'completed', date: '2026-09-17', staff: 'Nguyễn Văn C' },
    { id: '#DH-110', customerName: 'Ngô Quốc Bảo', phone: '0981555777', province: 'Quảng Ninh', district: 'Hạ Long', address: 'Số 16 Bãi Cháy, TP. Hạ Long, Quảng Ninh', brand: 'Apple', product: 'iPhone 16 Pro Max 512GB', quantity: 1, total: 34990000, deposit: 5000000, type: 'PreOrder', status: 'preorder', date: '2026-09-17', staff: 'Trần Thị H' },
  ];

  window.PhoneStoreSync = {
    getProducts: function() {
      const data = localStorage.getItem('PHONE_STORE_PRODUCTS');
      if (!data) {
        localStorage.setItem('PHONE_STORE_PRODUCTS', JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
      }
      return JSON.parse(data);
    },

    saveProducts: function(products) {
      localStorage.setItem('PHONE_STORE_PRODUCTS', JSON.stringify(products));
    },

    getBrandRevenue: function() {
      const data = localStorage.getItem('PHONE_STORE_BRAND_REVENUE');
      if (!data) {
        localStorage.setItem('PHONE_STORE_BRAND_REVENUE', JSON.stringify(DEFAULT_BRAND_REVENUE));
        return { ...DEFAULT_BRAND_REVENUE };
      }
      return JSON.parse(data);
    },

    saveBrandRevenue: function(rev) {
      localStorage.setItem('PHONE_STORE_BRAND_REVENUE', JSON.stringify(rev));
    },

    getOrders: function() {
      const data = localStorage.getItem('PHONE_STORE_ORDERS');
      if (!data) {
        localStorage.setItem('PHONE_STORE_ORDERS', JSON.stringify(DEFAULT_ORDERS));
        return DEFAULT_ORDERS;
      }
      return JSON.parse(data);
    },

    saveOrders: function(orders) {
      localStorage.setItem('PHONE_STORE_ORDERS', JSON.stringify(orders));
    },

    /**
     * HÀM CỐT LÕI: Xử lý khi khách hàng mua hàng
     * 1. Trừ tồn kho sản phẩm trong kho
     * 2. Cộng doanh thu vào hãng tương ứng (Apple / Xiaomi / Vivo) và tổng doanh thu
     * 3. Lưu đơn hàng vào danh sách đơn hàng cho Admin
     * 4. Bắn sự kiện đồng bộ
     */
    processPurchase: function(orderInfo) {
      const {
        customerName,
        phone,
        province,
        district,
        street,
        brand,
        productName,
        quantity = 1,
        total = 0,
        type = 'Standard',
        deposit = 0
      } = orderInfo;

      // Chuẩn hóa tên hãng (Apple, Xiaomi, Vivo)
      let normBrand = 'Apple';
      const bLower = (brand || '').toLowerCase();
      if (bLower.includes('xiaomi') || (productName && productName.toLowerCase().includes('xiaomi')) || (productName && productName.toLowerCase().includes('redmi'))) {
        normBrand = 'Xiaomi';
      } else if (bLower.includes('vivo') || (productName && productName.toLowerCase().includes('vivo'))) {
        normBrand = 'Vivo';
      } else {
        normBrand = 'Apple';
      }

      // 1. TRỪ TỒN KHO TRONG KHO HÀNG
      const products = this.getProducts();
      let deductedStock = false;
      let matchedProd = null;

      // Tìm theo tên máy hoặc id
      for (let p of products) {
        if (productName && p.name && (p.name.toLowerCase().includes(productName.toLowerCase()) || productName.toLowerCase().includes(p.name.toLowerCase()))) {
          matchedProd = p;
          break;
        }
      }
      // Nếu chưa thấy, tìm sản phẩm thuộc hãng đó
      if (!matchedProd) {
        matchedProd = products.find(p => p.brand.toLowerCase() === normBrand.toLowerCase());
      }

      if (matchedProd) {
        const oldStock = matchedProd.stock;
        matchedProd.stock = Math.max(0, matchedProd.stock - quantity);
        matchedProd.sold = (matchedProd.sold || 0) + quantity;
        this.saveProducts(products);
        deductedStock = true;
        console.log(`[PhoneStoreSync] Đã trừ tồn kho máy [${matchedProd.name}]: ${oldStock} -> ${matchedProd.stock} (Giảm ${quantity})`);
      }

      // 2. CỘNG TIỀN VÀO DOANH THU HÃNG TƯƠNG ỨNG
      const brandRev = this.getBrandRevenue();
      if (!brandRev[normBrand]) brandRev[normBrand] = 0;
      brandRev[normBrand] += total;
      brandRev.total = (brandRev.total || 0) + total;
      this.saveBrandRevenue(brandRev);
      console.log(`[PhoneStoreSync] Đã cộng doanh thu hãng ${normBrand}: +${total.toLocaleString('vi-VN')} ₫. Tổng hãng mới: ${brandRev[normBrand].toLocaleString('vi-VN')} ₫`);

      // 3. LƯU ĐƠN HÀNG MỚI VÀO DANH SÁCH ĐƠN
      const orders = this.getOrders();
      const newId = '#DH-' + (orders.length + 101);
      const todayStr = new Date().toISOString().split('T')[0];
      const fullAddress = `${street || ''}, ${district || ''}, ${province || ''}`.replace(/^,\s*|,\s*$/g, '');

      const newOrder = {
        id: newId,
        customerName: customerName,
        phone: phone,
        province: province || 'Chưa chọn',
        district: district || 'Chưa cập nhật',
        address: fullAddress,
        brand: normBrand,
        product: productName,
        quantity: quantity,
        total: total,
        deposit: deposit || 0,
        type: type || 'Standard',
        status: type === 'PreOrder' ? 'preorder' : 'pending',
        date: todayStr,
        staff: 'Chờ phân công'
      };

      orders.unshift(newOrder);
      this.saveOrders(orders);

      // 4. KÍCH HOẠT SỰ KIỆN LOCALSTORAGE ĐỂ CÁC TAB ADMIN NHẬN ĐƯỢC TỨC THÌ
      try {
        localStorage.setItem('PHONE_STORE_LAST_EVENT', JSON.stringify({
          type: 'PURCHASE_MADE',
          brand: normBrand,
          product: productName,
          quantity: quantity,
          total: total,
          orderId: newId,
          timestamp: Date.now()
        }));
      } catch(e) {}

      return {
        success: true,
        orderId: newId,
        brand: normBrand,
        addedRevenue: total,
        brandTotalRevenue: brandRev[normBrand],
        newStock: matchedProd ? matchedProd.stock : null
      };
    }
  };

  // Tự động khởi tạo dữ liệu mẫu nếu chưa có trong LocalStorage
  if (!localStorage.getItem('PHONE_STORE_PRODUCTS')) {
    localStorage.setItem('PHONE_STORE_PRODUCTS', JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem('PHONE_STORE_BRAND_REVENUE')) {
    localStorage.setItem('PHONE_STORE_BRAND_REVENUE', JSON.stringify(DEFAULT_BRAND_REVENUE));
  }
  if (!localStorage.getItem('PHONE_STORE_ORDERS')) {
    localStorage.setItem('PHONE_STORE_ORDERS', JSON.stringify(DEFAULT_ORDERS));
  }
})();

