<template>
	<div id="card" class="p-5 bg-yellow-100 border-[1px_solid_#e2d36b]">
		<p class="">
			{{ text }}
		</p>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
	props: {
		text: String,
	},
})
export default class Card extends Vue {
	type: "info" | "warning" | "error" | "success" = "info";
}
</script>

<style lang="scss" scoped>
#card {
	border-radius: 0.3rem;
	border-left: 5px solid orange;

	box-shadow: 0 1px 3px rgb(0 0 0 / 5%), rgb(0 0 0 / 5%) 0px 28px 23px -7px, rgb(0 0 0 / 4%) 0px 12px 12px -7px;
}
</style>
