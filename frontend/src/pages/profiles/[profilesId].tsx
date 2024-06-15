import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/profiles/profilesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditProfiles = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    name: '',

    location: '',

    about: '',

    subdomain: '',

    pages: [],

    portfolios: [],

    exhibitions: [],

    tenant: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { profiles } = useAppSelector((state) => state.profiles);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { profilesId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: profilesId }));
  }, [profilesId]);

  useEffect(() => {
    if (typeof profiles === 'object') {
      setInitialValues(profiles);
    }
  }, [profiles]);

  useEffect(() => {
    if (typeof profiles === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = profiles[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [profiles]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: profilesId, data }));
    await router.push('/profiles/profiles-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit profiles')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit profiles'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Name'>
                <Field name='name' placeholder='Name' />
              </FormField>

              <FormField label='Location'>
                <Field name='location' placeholder='Location' />
              </FormField>

              <FormField label='About' hasTextareaHeight>
                <Field name='about' as='textarea' placeholder='About' />
              </FormField>

              <FormField label='Subdomain'>
                <Field name='subdomain' placeholder='Subdomain' />
              </FormField>

              <FormField label='Pages' labelFor='pages'>
                <Field
                  name='pages'
                  id='pages'
                  component={SelectFieldMany}
                  options={initialValues.pages}
                  itemRef={'pages'}
                  showField={'title'}
                ></Field>
              </FormField>

              <FormField label='Portfolios' labelFor='portfolios'>
                <Field
                  name='portfolios'
                  id='portfolios'
                  component={SelectFieldMany}
                  options={initialValues.portfolios}
                  itemRef={'portfolios'}
                  showField={'title'}
                ></Field>
              </FormField>

              <FormField label='Exhibitions' labelFor='exhibitions'>
                <Field
                  name='exhibitions'
                  id='exhibitions'
                  component={SelectFieldMany}
                  options={initialValues.exhibitions}
                  itemRef={'exhibitions'}
                  showField={'title'}
                ></Field>
              </FormField>

              <FormField label='tenant' labelFor='tenant'>
                <Field
                  name='tenant'
                  id='tenant'
                  component={SelectField}
                  options={initialValues.tenant}
                  itemRef={'tenants'}
                  showField={'name'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/profiles/profiles-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditProfiles.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_PROFILES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditProfiles;
