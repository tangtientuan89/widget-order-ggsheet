<template>
  <div class="order-ggsheet">
    <p class="ggsheet__title">ORDER GOOGLE SHEET</p>
    <div class="customer__info">
      <hr />
      <p class="all__text--decoration mb-0">Khách hàng</p>
      <div class="form-row">
        <div class="col">
          <input class="form-control-sm" placeholder="Họ Tên" v-model="info.name" title="Họ Tên" />
        </div>
        <div class="col">
          <input
            class="form-control-sm"
            type="number"
            placeholder="Số ĐT"
            v-model="info.phone"
            title="Số điện thoại"
          />
        </div>
      </div>
      <input
        class="form-control-sm"
        placeholder="Địa chỉ chi tiết"
        v-model="street"
        title="Địa chỉ chi tiết"
      />
      <div class="form-row">
        <div class="col">
          <select v-model="country" class="form-control-sm">
            <option selected value>Việt Nam</option>
            <!-- <option >Quốc Gia</option> -->
          </select>
        </div>
        <div class="col">
          <Autocomplete
            :list_data_input="list_city"
            :placeholder="'Tỉnh/Tp'"
            @data_output="city=$event"
            :getData="getDistrict"
            :prop_name="'name'"
            :clearInput="resetChangeCity"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="col">
          <Autocomplete
            :list_data_input="list_district"
            :placeholder="'Quận/Huyện'"
            @data_output="district=$event"
            :getData="getWard"
            :prop_name="'name'"
            :clearInput="resetChangeDistrict"
            :watch_data="district"
          />
        </div>
        <div class="col">
          <Autocomplete
            :list_data_input="list_ward"
            :placeholder="'Phường/Xã'"
            @data_output="ward=$event"
            :getData="false"
            :prop_name="'name'"
            :clearInput="false"
            :watch_data="ward"
          />
        </div>
      </div>
    </div>
    <div class="customer__product">
      <hr />
      <p class="all__text--decoration mb-0">Sản phẩm</p>
      <textarea
        class="form-control-sm"
        placeholder="Sản Phẩm"
        v-model="info.product"
        title="Sản Phẩm"
      ></textarea>
    </div>
    <div class="customer__price">
      <hr />
      <p class="all__text--decoration mb-0">Giá Trị Đơn Hàng</p>
      <input
        id="input"
        class="form-control-sm text-right"
        type="text"
        placeholder="Giá Trị Đơn Hàng"
        title="Giá Trị Đơn Hàng"
        v-model="info.total_price"
        data-type="currency"
        @keyup="checkKeyBoard($event,$event.target.value)"
      />
    </div>

    <div class="customer__note mb-3 d-flex justify-content-end">
      <div class="d-flex align-items-center" @click="handleShowNote">
        <img class="mr-2" src="../assets/note.png" alt="add note" />
        <p class="text-primary m-0">Thêm ghi chú</p>
      </div>
    </div>
    <div v-if="is_show_note">
      <textarea
        class="input input-large note form-control-sm mb-2"
        placeholder="Ghi Chú"
        title="Ghi chú"
        v-model="info.note"
      ></textarea>
    </div>
    <div class="text-right mb-2">
      <button class="btn-pill w-100 my-2" @click="handleShowOrderInfo()">Tạo đơn hàng</button>
    </div>
    <OrderInfo
      :is_show_order_info="is_show_order_info"
      :handleCloseOrderInfo="handleCloseOrderInfo"
      :createOrder="createOrder"
      :info="info"
    />
  </div>
</template>

<script>
import fetch from "@/services/resful.js";
import OrderInfo from "./OrderInfo";
import Autocomplete from "./Autocomplete.vue";

export default {
  components: {
    OrderInfo,
    Autocomplete,
  },
  props: ["payload"],
  data() {
    return {
      url_ggform: "",
      entry: [],
      info: {
        name: this.payload.to_name,
        phone: this.payload.to_phone,
        address: "",
        product: "",
        total_price: 0,
        total_price_num: 0,
        note: "",
      },
      number: "",
      country: "",
      list_city: "",
      city: "",
      list_district: "",
      district: "",
      list_ward: "",
      ward: "",
      street: "",
      handle_api: false,
      is_show_note: false,
      is_show_order_info: false,
    };
  },
  mounted() {
    this.getCity();
    let data_localStorage = JSON.parse(
      localStorage.getItem("widget_order_ggsheet")
    );
    console.log("widget_order_ggsheet", data_localStorage);
    this.url_ggform = data_localStorage.url_ggform;
    this.entry = data_localStorage.entry;
    if (this.url_ggform && this.entry.length) {
      this.hide_form_order = false;
      this.hide_url_ggform = true;
    }
  },

  methods: {
    async createOrder() {
      if (this.handle_api) return;
      this.handle_api = true;
      console.log(" this.entry", this.entry);
      let body = {};
      body[`entry.${this.entry[0]}`] = this.info.name;
      body[`entry.${this.entry[1]}`] = this.info.phone;
      body[`entry.${this.entry[2]}`] = this.info.address;
      body[`entry.${this.entry[3]}`] = this.info.product;
      body[`entry.${this.entry[4]}`] = this.info.total_price_num;
      body[`entry.${this.entry[5]}`] = this.info.note;
      console.log("body", body);
      // let add_data_sheet = await fetch.post(API, body);
      console.log("url", this.url_ggform);
      $.ajax({
        method: "POST",
        url: this.url_ggform,
        data: body,
        success: (r) => {
          console.log("r", r);
          this.handle_api = false;
        },
        error: (e) => {
          console.log(e);
          this.handle_api = false;
          this.handleCloseOrderInfo();
          this.swalToast("Tạo đơn thành công", "success");
        },
      });
    },
    async getCity() {
      try {
        let get_list_city = await fetch.get(
          "https://ext.botup.io/v1/delivery/subvn/thongtin/tinhtp"
        );
        if (get_list_city && get_list_city.data && get_list_city.data.data) {
          this.list_city = get_list_city.data.data;
        }
        console.log(" this.list_city", this.list_city);
      } catch (e) {
        console.log(e);
      }
    },
    async getDistrict() {
      try {
        let path = "https://ext.botup.io/v1/delivery/subvn/thongtin/quanhuyen";
        let params = {
          matinh: this.city.code,
        };

        let get_list_district = await fetch.get(path, params);
        if (
          get_list_district &&
          get_list_district.data &&
          get_list_district.data.data
        ) {
          this.list_district = get_list_district.data.data;
        }
        console.log("  this.list_district", this.list_district);
      } catch (error) {
        console.log("error", error);
      }
    },
    async getWard() {
      try {
        let path =
          "https://ext.botup.io/v1/delivery/subvn/thongtin/xaphuonghuyen";
        let params = {
          mahuyen: this.district.code,
        };

        let get_list_ward = await fetch.get(path, params);

        if (get_list_ward && get_list_ward.data && get_list_ward.data.data) {
          this.list_ward = get_list_ward.data.data;
        }
        console.log(" this.list_ward", this.list_ward);
      } catch (error) {
        console.log("error", error);
      }
    },
    resetAddress() {
      this.address = "";
      this.street = "";
      this.district = "";
      this.ward = "";
    },
    resetChangeCity() {
      this.district = "";
      this.ward = "";
    },
    resetChangeDistrict() {
      this.ward = "";
    },
    handleShowNote() {
      this.is_show_note = !this.is_show_note;
    },
    handleShowOrderInfo() {
      if (!this.validateOrder()) return;
      this.info.address = `${this.street}, ${this.ward.name}, ${this.district.name}, ${this.city.name}`;
      this.is_show_order_info = true;
    },
    handleCloseOrderInfo() {
      this.is_show_order_info = false;
    },
    validateOrder() {
      if (!this.info.name) {
        return this.swalToast("Bạn chưa nhập Họ Tên", "warning");
      }
      if (!this.info.phone) {
        return this.swalToast("Bạn chưa nhập Số ĐT", "warning");
      }
      let phone = this.info.phone.toString();
      if (phone.length != 10 || phone[0] != 0) {
        return this.swalToast("Số ĐT không đúng", "warning");
      }
      if (
        !this.street ||
        !this.city.name ||
        !this.district.name ||
        !this.ward.name
      ) {
        return this.swalToast("Bạn chưa nhập đầy đủ Địa Chỉ", "warning");
      }
      if (!this.info.product) {
        return this.swalToast("Bạn chưa nhập Sản phẩm", "warning");
      }
      if (!this.info.total_price) {
        return this.swalToast("Bạn chưa nhập Tổng giá đơn", "warning");
      }
      return true;
    },
    //handle input (giá trị đơn hàng) show number money
    async checkKeyBoard(event, string) {
      if (
        event.keyCode == 37 ||
        event.keyCode == 39 ||
        event.keyCode == 8 ||
        event.keyCode == 46
      )
        return;
      let caret_pos = event.target.selectionStart;
      let input = document.getElementById("input");
      let number_length = await this.formatNumber(string);
      //handle caret_pos when number length = 3*x+1
      if (number_length == Math.floor(number_length / 3) * 3 + 1) {
        caret_pos = caret_pos + 1;
      }
      //focus in position
      if (input != null) {
        if (input.createTextRange) {
          let range = input.createTextRange();
          range.move("character", caret_pos);
          range.select();
        } else {
          if (input.selectionStart) {
            input.focus();
            input.setSelectionRange(caret_pos, caret_pos);
          } else input.focus();
        }
      }

      if (event.keyCode == 8) {
      }
    },
    async formatNumber(string) {
      let number = string.replace(/\D/g, "");
      this.info.total_price_num = number;
      this.info.total_price = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "VND",
      }).format(number);
      console.log("number", number);
      return number.length;
    },
    swalToast(title, icon) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: false,
        onOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: icon,
        title: title,
        padding: "5px",
      });
    },
  },

  filters: {
    toCurrency(value) {
      // console.log('type num',typeof value);
      let formatter = new Intl.NumberFormat("de-DE", {
        style: "currency",
        minimumFractionDigits: 0,
        currency: "VND",
      });
      return formatter.format(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.order-ggsheet {
  padding: 10px;
  line-height: 1.5rem;
  box-sizing: border-box;
  // ::-webkit-scrollbar {
  //   width: 0px;
  //   background-color: rgb(225, 225, 225);
  // }
  .ggsheet__title {
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
    padding-bottom: 1rem;
  }
  .customer__info,
  .customer__product,
  .customer__price {
    position: relative;
    padding-bottom: 10px;
  }
  .customer__note {
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
    }
  }
}

textarea {
  height: 40px;
}
input,
select {
  margin-bottom: 10px;
}
button {
  font-weight: 600;
}
</style>