<template>
  <div>
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Họ Tên</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Họ Tên"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Số điện thoại</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Số điện thoại"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Địa chỉ</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Địa chỉ"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Thông tin sản phẩm</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Thông tin sản phẩm"
        />
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Ghi Chú</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Ghi chú"
        />
      </div>
        <Demo/>
      <button type="submit" class="btn btn-primary">Lưu</button>
    </form>
  </div>
</template>

<script>
import Demo from "@/components/Demo"
export default {
    components:{
        Demo:Demo
    }
};
</script>

<style lang="scss" scoped>
</style>