import productModal from './productModal.js';

// API 連結變數設定
const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'peihanwang-hexschool';

// 將方法與規則解構出來
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;

// 定義規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 讀取外部資源
loadLocaleFromURL(
  'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json'
);

configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

Vue.createApp({
  data() {
    return {
      products: [],
      productId: '',
      cart: {},
      loadingItem: '', // 存 id
      // 表單驗證與回傳訂單資料使用
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      // vue loading
      fullPage: false,
    };
  },
  methods: {
    // 取得產品列表
    getProducts() {
      //取得產品列表時 vue loading 效果開啟
      let loader = this.$loading.show();
      axios
        .get(`${apiUrl}/v2/api/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products;
          //取得產品列表後 vue loading 效果關閉
          loader.hide();
        })
        .catch((err) => {
          alert(err);
        });
    },
    // 打開查看更多 Modal
    openModal(id) {
      this.productId = id;
    },
    // 產品資料加入購物車
    addToCart(product_id, qty = 1) {
      //當沒有傳入參數時，會使用預設值
      const data = {
        product_id,
        qty,
      };
      axios
        .post(`${apiUrl}/v2/api/${apiPath}/cart`, { data }) // { data : data }
        .then((res) => {
          this.$refs.productModal.hideModal();
          this.getCart(); // 加入購物車後，重新整理購物車資料
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.message);
        });
    },
    // 取得購物車資料
    getCart() {
      axios
        .get(`${apiUrl}/v2/api/${apiPath}/cart`)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => {
          alert(err.message);
        });
    },
    // 更新購物車資料
    upDataCartItem(item) {
      const data = {
        product_id: item.product.id,
        qty: item.qty,
      };
      this.loadingItem = item.id;
      axios
        .put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`, { data })
        .then((res) => {
          this.getCart();
          this.loadingItem = '';
        })
        .catch((err) => {
          alert(err.message);
        });
    },
    // 刪除購物車單項項目
    deleteCartItem(item) {
      this.loadingItem = item.id;
      axios
        .delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)
        .then((res) => {
          this.getCart();
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.message);
        });
    },
    // 刪除所有購物車項目
    deleteAllCartItem(item) {
      if (this.cart.length > 0) {
        axios
          .delete(`${apiUrl}/v2/api/${apiPath}/carts`)
          .then((res) => {
            this.getCart();
            alert(res.data.message);
          })
          .catch((err) => {
            alert(err.message);
          });
      } else {
        alert('您的購物車並沒有任何商品喔');
      }
    },
    // 建立訂單
    submitOrder() {
      const order = this.form;
      let loader = this.$loading.show();
      if (this.cart.carts.length < 1) {
        alert('您的購物車尚未有商品，無法進行結帳!!');
        loader.hide();
      } else {
        axios
          .post(`${apiUrl}/v2/api/${apiPath}/order`, { data: order })
          .then((res) => {
            this.$refs.form.resetForm();
            this.form.message = '';
            this.getCart();
            alert(res.data.message);
            loader.hide();
          })
          .catch((err) => {
            alert(err.message);
          });
      }
    },
  },
  components: {
    productModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
})
  .use(VueLoading.LoadingPlugin)
  .mount('#app');
