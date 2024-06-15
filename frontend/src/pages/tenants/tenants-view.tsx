import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/tenants/tenantsSlice';
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

const TenantsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tenants } = useAppSelector((state) => state.tenants);

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
        <title>{getPageTitle('View tenants')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View tenants')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{tenants?.name}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Users Tenants</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>

                      <th>Last Name</th>

                      <th>Phone Number</th>

                      <th>E-Mail</th>

                      <th>Disabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.users_tenant &&
                      Array.isArray(tenants.users_tenant) &&
                      tenants.users_tenant.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/users/users-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='firstName'>{item.firstName}</td>

                          <td data-label='lastName'>{item.lastName}</td>

                          <td data-label='phoneNumber'>{item.phoneNumber}</td>

                          <td data-label='email'>{item.email}</td>

                          <td data-label='disabled'>
                            {dataFormatter.booleanFormatter(item.disabled)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!tenants?.users_tenant?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Exhibitions tenant</p>
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
                    {tenants.exhibitions_tenant &&
                      Array.isArray(tenants.exhibitions_tenant) &&
                      tenants.exhibitions_tenant.map((item: any) => (
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
              {!tenants?.exhibitions_tenant?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Messages tenant</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.messages_tenant &&
                      Array.isArray(tenants.messages_tenant) &&
                      tenants.messages_tenant.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/messages/messages-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='content'>{item.content}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!tenants?.messages_tenant?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Pages tenant</p>
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
                    {tenants.pages_tenant &&
                      Array.isArray(tenants.pages_tenant) &&
                      tenants.pages_tenant.map((item: any) => (
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
              {!tenants?.pages_tenant?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Portfolios tenant</p>
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
                    {tenants.portfolios_tenant &&
                      Array.isArray(tenants.portfolios_tenant) &&
                      tenants.portfolios_tenant.map((item: any) => (
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
              {!tenants?.portfolios_tenant?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Profiles tenant</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>

                      <th>Location</th>

                      <th>About</th>

                      <th>Subdomain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.profiles_tenant &&
                      Array.isArray(tenants.profiles_tenant) &&
                      tenants.profiles_tenant.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/profiles/profiles-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='location'>{item.location}</td>

                          <td data-label='about'>{item.about}</td>

                          <td data-label='subdomain'>{item.subdomain}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!tenants?.profiles_tenant?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Settings tenant</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>DarkMode</th>

                      <th>CustomCSS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.settings_tenant &&
                      Array.isArray(tenants.settings_tenant) &&
                      tenants.settings_tenant.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/settings/settings-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='dark_mode'>
                            {dataFormatter.booleanFormatter(item.dark_mode)}
                          </td>

                          <td data-label='custom_css'>{item.custom_css}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!tenants?.settings_tenant?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/tenants/tenants-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

TenantsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_TENANTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default TenantsView;
