import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import { City, District, Ward } from 'src/constants/contant'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import axios from 'axios';

import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { setProfileToLS } from 'src/utils/auth'

import InputFile from 'src/components/InputFile'
import { UserSchema, userSchema } from 'src/utils/rules'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import DateSelect from '../../components/DateSelect'
import { u } from 'msw/lib/glossary-de6278a9'

function Info() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()
  return (
    <Fragment>
      <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                placeholder='Số điện thoại'
                errorMessage={errors.phone?.message}
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </Fragment>
  )
}

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
// note: because type of date_of_birth is Date, so we need to convert it to string
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

// Flow 1:
// Nhấn upload: upload lên server luôn => server trả về url ảnh
// Nhấn submit thì gửi url ảnh cộng với data lên server

// Flow 2:
// Nhấn upload: không upload lên server
// Nhấn submit thì tiến hành upload lên server, nếu upload thành công thì tiến hành gọi api updateProfile

export default function Profile() {


  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [specificAddress, setSpecificAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<any>('https://online-gateway.ghn.vn/shiip/public-api/master-data/province',{
          headers: {
            'token': '5b44734c-e7ae-11ee-8529-6a2e06bbae55'
          }
        });
        setCities(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value.split("_")[1];
    setSelectedCity(e.target.value);
    console.log('Selected city:', cityId);
    fetchDatadistrict(cityId)

  };

  const fetchDatadistrict = async (id: any) => {
    try {
      const response = await axios.get<any>(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
        {
          headers: {
            'token': '5b44734c-e7ae-11ee-8529-6a2e06bbae55'
          },
          params: {
            province_id: id
          }
        }
      );
      setDistricts(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value.split("_")[1];
    setSelectedDistrict(e.target.value);
    fetchDataward(districtId)
  };
  const fetchDataward = async (id: any) => {
    try {
      const response = await axios.get<any>(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
        {
          headers: {
            'token': '5b44734c-e7ae-11ee-8529-6a2e06bbae55'
          },
          params: {
            district_id : id
          }
        }
      );
      setWards(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWard(e.target.value);
  };



  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const id = localStorage.getItem('id');
  const userId = id !== null ? parseInt(id) : 0;
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userApi.getProfile(userId)
  })
  const profile = profileData?.data.data

  const updateProfileMutation = useMutation((body: BodyUpdateProfile) => userApi.updateProfile(body, userId));


  const uploadAvatarMutaion = useMutation(userApi.uploadAvatar)
  const methods = useForm<FormData>({
    defaultValues: {
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    setError
  } = methods

  const avatar = watch('avatar')


  interface BodyUpdateProfile {
    phone: string | undefined;
    city: string | undefined;
    district: string | undefined;
    ward: string | undefined;
    detailLocation: string | undefined;
  }
  

  useEffect(() => {
    if (profile) {
      console.log(profile);
      setValue('name', profile.email)
      setValue('phone', profile.phone)
      setValue('address', profile.detailLocation)
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    event?.preventDefault();
    try {
    const bodyUpdateProfile: BodyUpdateProfile = {
      phone: data.phone,
      city: selectedCity.split("_")[0],
      district: selectedDistrict.split("_")[0],
      ward: selectedWard.split("_")[0],
      detailLocation: data.address
    };
    console.log(bodyUpdateProfile);

    const res = await updateProfileMutation.mutateAsync(bodyUpdateProfile);
    toast.success('Cập nhật hồ sơ thành công');
    setProfile(res.data.data);
    setProfileToLS(res.data.data);
    refetch();
  } catch (error) {
    if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
      const formError = error.response?.data.data;
      if (formError) {
        Object.keys(formError).forEach((key) => {
          setError(key as keyof FormDataError, {
            message: formError[key as keyof FormDataError],
            type: 'Server'
          });
        });
      }
    } else {
      console.error('Error updating profile:', error);
      toast.error('Cập nhật hồ sơ thất bại');
    }
  }
  });
  

  const handleChangeFile = (file?: File | undefined) => {
    setFile(file)
  }
  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <FormProvider {...methods}>
        <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <Info />
            <div className="flex flex-col items-center space-y-4">
  <select 
    value={selectedCity} 
    onChange={handleCityChange} 
    className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
  >
    <option value="">Chọn tỉnh thành</option>
    {cities.map(city => (
      <option key={city.ProvinceID} value={`${city.ProvinceName}_${city.ProvinceID}`}>{city.ProvinceName}</option>
    ))}
  </select>
  <select 
    value={selectedDistrict} 
    onChange={handleDistrictChange} 
    className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
  >
    <option value="">Chọn quận huyện</option>
    {districts.map(district => (
      <option key={district.DistrictID} value={`${district.DistrictName}_${district.DistrictID}`}>{district.DistrictName}</option>
    ))}
  </select>
  <select 
    value={selectedWard} 
    onChange={handleWardChange} 
    className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
  >
    <option value="">Chọn phường xã</option>
    {wards.map(ward => (
      <option key={ward.WardCode} value={`${ward.WardName}_${ward.WardCode}`}>{ward.WardName}</option>
    ))}
  </select>

              </div>
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ chi tiết</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  register={register}
                  name='address'
                  placeholder='Địa chỉ chi tiết'
                  errorMessage={errors.address?.message}
                />
              </div>
            </div>
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <span>{profile?.city} - {profile?.district} - {profile?.ward} - {profile?.detailLocation} </span>
            </div>
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                  type='submit'
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  src={file ? previewImage : getAvatarUrl(avatar)}
                  alt='avatar'
                  className='h-full w-full rounded-full object-cover'
                />
              </div>
              <InputFile onChange={handleChangeFile} />

              <div className='mt-3 text-gray-400'>
                <div>Dụng lượng file tối đa 1 MB</div>
                <div>Định dạng:.JPEG, .PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
