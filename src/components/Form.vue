<template>
  <div>
    <div>
      <p class="mb-0 mt-3 font-weight-bold">Thông tin đơn hàng</p>
      <div class="form-row">
        <div class="col">
          <input class="form-control" placeholder="Họ Tên" v-model="info.name" />
        </div>
        <div class="col">
          <input class="form-control" placeholder="Số ĐT" v-model="info.phone" />
        </div>
      </div>
      <input class="form-control" placeholder="Địa chỉ chi tiết" v-model="address" />
      <div class="form-row">
        <div class="col">
          <select v-model="country" class="form-control">
            <option selected value>Quốc Gia</option>
            <option>Việt Nam</option>
          </select>
        </div>
        <div class="col">
          <select v-model="city" @change="getDistrict()" class="form-control">
            <option selected value>Tỉnh/Tp</option>
            <option v-for="(city, index) in list_city" :value="city" :key="index">{{city.name}}</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="col">
          <select v-model="district" @change="getWard()" class="form-control">
            <option selected value>Quận/Huyện</option>
            <option
              v-for="(district, index) in list_district"
              :value="district"
              :key="index"
            >{{district.name}}</option>
          </select>
        </div>
        <div class="col">
          <select v-model="ward" class="form-control">
            <option selected value>Phường/Xã</option>
            <option v-for="(ward, index) in list_ward" :value="ward" :key="index">{{ward.name}}</option>
          </select>
        </div>
      </div>
      <p class="mb-0 mt-2">Sản Phẩm</p>
      <textarea class="form-control" placeholder="Sản Phẩm" v-model="info.product"></textarea>
      <p class="mb-0 mt-2">Giá Trị Đơn Hàng</p>
      <input
        class="form-control text-right"
        type="number"
        placeholder="Giá Trị Đơn Hàng"
        v-model="info.total_price"
      />
      <div class="option my-3 d-flex justify-content-end">
        <div class="d-flex align-items-center" @click="handleShowNote">
          <img class="mr-2" src="../assets/note.png" alt="add note" />
          <p class="text-primary m-0">Thêm ghi chú</p>
        </div>
      </div>
      <div v-if="is_show_note">
        <textarea
          class="input input-large note form-control"
          placeholder="Ghi Chú"
          v-model="info.note"
        ></textarea>
      </div>
      <div class="text-right mb-2">
        <button class="btn btn-primary w-100 my-2" @click="handleShowOrderInfo()">Tạo đơn hàng</button>
      </div>
      <OrderInfo
        :is_show_order_info="is_show_order_info"
        :handleCloseOrderInfo="handleCloseOrderInfo"
        :createOrder="createOrder"
        :info="info"
      />
    </div>
  </div>
</template>

<script>

import fetch from "@/services/resful.js";
import OrderInfo from "./OrderInfo";

export default {
  components: {
    OrderInfo,
  },
  props: ["name", "phone"],
  data() {
    return {
      url_ggform: "",
      entry: [],
      info: {
        name: this.name,
        phone: this.phone,
        address: "",
        product: "",
        total_price: 0,
        note: "",
      },
      country: "",
      list_city: "",
      city: "",
      list_district: "",
      district: "",
      list_ward: "",
      ward: "",
      address: "",
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
    btn_changeURL() {
      this.hide_btn_cancel = false;
      this.hide_url_ggform = false;
      this.hide_form_order = true;
    },
    btn_cancel() {
      this.hide_btn_cancel = true;
      this.hide_form_order = false;
      this.hide_url_ggform = true;
    },
    async createOrder() {
      console.log(" this.entry", this.entry);
      let body = {};
      body[`entry.${this.entry[0]}`] = this.info.name;
      body[`entry.${this.entry[1]}`] = this.info.phone;
      body[`entry.${this.entry[2]}`] = this.info.address;
      body[`entry.${this.entry[3]}`] = this.info.product;
      body[`entry.${this.entry[4]}`] = this.info.total_price;
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
        },
        error: (e) => {
          console.log(e);
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
        this.list_city = get_list_city.data.data;
        console.log(" this.list_city", this.list_city);
      } catch (e) {
        console.log(e);
      }
    },
    async getDistrict() {
      try {
        console.log("handle here", this.city);
        let path = "https://ext.botup.io/v1/delivery/subvn/thongtin/quanhuyen";
        let params = {
          matinh: this.city.code,
        };
        let get_list_district = await fetch.get(path, params);
        this.list_district = get_list_district.data.data;
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
        this.list_ward = get_list_ward.data.data;
        console.log(" this.list_ward", this.list_ward);
      } catch (error) {
        console.log("error", error);
      }
    },
    handleShowNote() {
      this.is_show_note = !this.is_show_note;
    },
    handleShowOrderInfo() {
      if (!this.validate_order()) return;
      this.info.address = `${this.address}, ${this.ward.full_name}`;
      this.is_show_order_info = true;
    },
    handleCloseOrderInfo() {
      this.is_show_order_info = false;
    },
    validate_order() {
      if (!this.info.name) {
        return this.swalToast("Bạn chưa nhập Họ Tên", "warning");
      }
      if (!this.info.phone) {
        return this.swalToast("Bạn chưa nhập Số ĐT", "warning");
      }
      if (!this.address || !this.city || !this.district || !this.ward) {
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
    format_number(number) {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "VND",
      }).format(number);
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
};
</script>

<style lang="scss" scoped>

$fontSize: 13px;
* {
  font-size: $fontSize;
  line-height: 16px;
  box-sizing: border-box;
  ::-webkit-scrollbar {
    width: 0px;
    background-color: rgb(225, 225, 225);
  }
}
input,
select {
  margin-bottom: 10px;
}
button {
  width: 4rem;
  padding-left: 0;
  padding-right: 0;
}
.option {
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
}
</style>