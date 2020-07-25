<template>
  <div class="container">
    <div
      v-if="!isOAuth"
      class="d-flex justify-content-center align-items-center"
      style="height:100%"
    >
      <button
        class="btn btn-primary align-self-center"
        style="height: 3rem;width: 6rem"
        @click="runOAuth()"
      >Kích hoạt</button>
    </div>
    <div v-if="isOAuth" style="height:100%">
      <p class="text-center pt-2 m-0" style="font-size:1rem; font-weight:600">Tạo Đơn Hàng</p>
      <Form />
    </div>
  </div>
</template>

<script>
import fetch from "@/services/resful.js";
import Form from "@/components/Form";
// const API = "https://chatbox-app.botbanhang.vn/v1/app/note";
const API = "https://app.devchatbox.tk/v1/app/note";
// const APIBase = "https://chatbox-app.botbanhang.vn";
const APIBase = "https://app.devchatbox.tk";
let url_string = location.href;
let url = new URL(url_string);
let access_token = url.searchParams.get("access_token");

export default {
  components: {
    Form: Form
  },
  data() {
    return {
      isOAuth: false,
      access_token: access_token,
      // secret_key: "c098f51f09af4fe78283ce83d50cd1ca", //product
      // secret_key: "bb1fa0ddc02d4d6cbaa30502c6ffb02f",
      secret_key: "7bd46085a2874c7d9f1920f26f3dcec1",
      content: "",
      allNote: [],
      payload: "",
      fb_page_id: "",
      fb_client_id: "",

      current_staff_id: "",
      current_staff_name: "",
      handleAPI: true,

      page: 1,
      list: [],
      infiniteId: +new Date()
    };
  },
  mounted() {},
  async created() {
    try {
      let body = {
        access_token: this.access_token,
        secret_key: this.secret_key
      };
      let get_customer_info = await fetch.post(
        `${APIBase}/v1/service/partner-authenticate`,
        body
      );
      console.log("get_customer_info", get_customer_info.data.data.public_profile);
      if (get_customer_info.data.succes && get_customer_info.data.code == 200) {
        this.isOAuth = true;
      }
      this.fb_page_id = get_customer_info.data.data.public_profile.fb_page_id;
      this.fb_client_id = get_customer_info.data.data.public_profile.fb_client_id;
      this.current_staff_id =
        get_customer_info.data.data.public_profile.current_staff_id;
      this.current_staff_name =
        get_customer_info.data.data.public_profile.current_staff_name;
    } catch (e) {
      console.log(e);
    }
  },

  methods: {
    async runOAuth() {
      try {
        let body = {
          _type: "oauth-access-token",
          access_token: this.access_token,
          token_partner: "active"
        };
        let Oauth = await fetch.post(
          `${APIBase}/v1/app/app-installed/update`,
          body
        );
        this.isOAuth = true;
        window.close();
      } catch (e) {
        console.log(e);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
*::-webkit-scrollbar {
  width: 0px;
  background-color: #0199ff;
}
body {
  box-sizing: border-box;
  .container {
    height: 100%;
  }
}
</style>