import axiosInstance from "@/lib/axios";

export const imageService = {
   async deleteImage(publicId: string) {
    const res = await axiosInstance.delete("/upload/delete", {
      data: { publicId },
    });
    return res.data;
  },
};
