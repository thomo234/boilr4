import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/profiles/profilesSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const ProfilesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profiles } = useAppSelector((state) => state.profiles);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View profiles')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View profiles')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{profiles?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Location</p>
            <p>{profiles?.location}</p>
          </div>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea className={'w-full'} disabled value={profiles?.about} />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Subdomain</p>
            <p>{profiles?.subdomain}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Pages</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.pages &&
                      Array.isArray(profiles.pages) &&
                      profiles.pages.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/pages/pages-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='title'>{item.title}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!profiles?.pages?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Portfolios</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>

                      <th>Description</th>

                      <th>Price</th>

                      <th>IssueNumber</th>

                      <th>Dimensions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.portfolios &&
                      Array.isArray(profiles.portfolios) &&
                      profiles.portfolios.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/portfolios/portfolios-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='title'>{item.title}</td>

                          <td data-label='description'>{item.description}</td>

                          <td data-label='price'>{item.price}</td>

                          <td data-label='issue_number'>{item.issue_number}</td>

                          <td data-label='dimensions'>{item.dimensions}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!profiles?.portfolios?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Exhibitions</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>

                      <th>Gallery</th>

                      <th>Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.exhibitions &&
                      Array.isArray(profiles.exhibitions) &&
                      profiles.exhibitions.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/exhibitions/exhibitions-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='title'>{item.title}</td>

                          <td data-label='gallery'>{item.gallery}</td>

                          <td data-label='credits'>{item.credits}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!profiles?.exhibitions?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>tenant</p>

            <p>{profiles?.tenant?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Exhibitions Profile</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>

                      <th>Gallery</th>

                      <th>Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.exhibitions_profile &&
                      Array.isArray(profiles.exhibitions_profile) &&
                      profiles.exhibitions_profile.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/exhibitions/exhibitions-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='title'>{item.title}</td>

                          <td data-label='gallery'>{item.gallery}</td>

                          <td data-label='credits'>{item.credits}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!profiles?.exhibitions_profile?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Pages Profile</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.pages_profile &&
                      Array.isArray(profiles.pages_profile) &&
                      profiles.pages_profile.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/pages/pages-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='title'>{item.title}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!profiles?.pages_profile?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Portfolios Profile</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>

                      <th>Description</th>

                      <th>Price</th>

                      <th>IssueNumber</th>

                      <th>Dimensions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.portfolios_profile &&
                      Array.isArray(profiles.portfolios_profile) &&
                      profiles.portfolios_profile.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/portfolios/portfolios-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='title'>{item.title}</td>

                          <td data-label='description'>{item.description}</td>

                          <td data-label='price'>{item.price}</td>

                          <td data-label='issue_number'>{item.issue_number}</td>

                          <td data-label='dimensions'>{item.dimensions}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!profiles?.portfolios_profile?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/profiles/profiles-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

ProfilesView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_PROFILES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default ProfilesView;
