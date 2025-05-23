import ChooseImg from "@/components/admin/blog/ChooseImg";
import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import UploadBlogImage from "@/components/uploadImageDialog";

export default function ImageUpload() {
  return (
    <div className="">
      <HeaderTitleDescription
        title="Upload Gallery"
        description="Upload the image to your Storage and use Around package Images multiple times."
      />
      <div className="flex  justify-center my-4 mb-12">
        <div className="max-w-sm w-full">
          <UploadBlogImage />
        </div>
      </div>
      <div className="group image-upload p-4">
        <ChooseImg showLink={true} />
      </div>
    </div>
  );
}
