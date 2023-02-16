import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'peihanwang-hexschool';

// 產品 Modal
const productModal = {
  data() {
    return {
      modal: {},
      tempProduct: {},
    };
  },
  template: '#userProductModal',
  mounted() {
    console.log(this.$refs);
    // this.modal = new bootstrap.Modal(this.$refs.modal);
    // this.modal.show();
  },
};

const app = createApp({
  data() {
    return {
      products: [],
    };
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`).then((res) => {
        console.log('產品列表:', res.data.products);
        this.products = res.data.products;
      });
    },
  },
  components: {
    productModal,
  },
  mounted() {
    this.getProducts();
  },
});

app.mount('#app');
