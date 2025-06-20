import { PhotoUpload } from '@/components/photo-upload';
import { Card, CardHeader, CardBody } from '@heroui/card';

export default function UploadPage() {
  return (
    <div>
      <div className='bg-background flex items-center justify-center p-4'>
        <Card className='w-full max-w-2xl sm:max-w-md'>
          <CardHeader className='flex flex-col gap-1'>
            <h1 className='text-2xl font-bold'>Upload Photo</h1>
            <p className='text-default-500'>
              Drag and drop or select a file to upload
            </p>
          </CardHeader>
          <CardBody>
            <PhotoUpload />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
