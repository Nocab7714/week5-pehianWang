// 產品 Modal
export default {
  // 當 id 變動時，取得遠端資料，並呈現 Modal
  props: ['id', 'addToCart', 'openModal'],
  data() {
    return {
      modal: {},
      tempProduct: {},
      qty: 1,
    };
  },
  template: `
  <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
        <span>{{ tempProduct.title }}</span>
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-6">
            <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
          </div>
          <div class="col-sm-6">
            <span class="badge bg-primary rounded-pill">{{  }}</span>
            <p>商品描述：{{ tempProduct.description }}</p>
            <p>商品內容：{{ tempProduct.content }}</p>
            <div class="h5" v-if="tempProduct.price === tempProduct.origin_price">{{ tempProduct.price }} 元</div>
            <div v-else>
              <del class="h6">原價 {{ tempProduct.origin_price }} 元</del>
              <div class="h5">現在只要 {{ tempProduct.price }} 元</div>
            </div>
            <div>
              <div class="input-group">
                <select name="" id="" class="form-select" v-model="qty">
                  <option :value="i" v-for="i in 25" :key="i">{{ i }}</option>
                </select>
                <button type="button" class="btn btn-danger" @click="addToCart(tempProduct.id, qty)"> 
                  加入購物車            
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  watch: {
    id() {
      const apiUrl = 'https://vue3-course-api.hexschool.io';
      const apiPath = 'peihanwang-hexschool';
      if (this.id) {
        axios
          .get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
          .then((res) => {
            this.tempProduct = res.data.product;
            this.modal.show();
          })
          .catch((err) => {
            alert(err.data.message);
          });
      }
    },
  },
  methods: {
    hideModal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    this.$refs.modal.addEventListener('hidden.bs.modal', (event) => {
      // 監聽 DOM，當 Modal 關閉時... 要做其他事情
      this.openModal('');
    });
  },
};
