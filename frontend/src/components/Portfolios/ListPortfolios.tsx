import React from 'react';
import CardBox from '../CardBox';
import ImageField from '../ImageField';
import dataFormatter from '../../helpers/dataFormatter';
import { saveFile } from '../../helpers/fileSaver';
import ListActionsPopover from '../ListActionsPopover';
import { useAppSelector } from '../../stores/hooks';
import { Pagination } from '../Pagination';
import LoadingSpinner from '../LoadingSpinner';

import { hasPermission } from '../../helpers/userPermissions';

type Props = {
  portfolios: any[];
  loading: boolean;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  currentPage: number;
  numPages: number;
  onPageChange: (page: number) => void;
};

const ListPortfolios = ({
  portfolios,
  loading,
  onEdit,
  onView,
  onDelete,
  currentPage,
  numPages,
  onPageChange,
}: Props) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const hasUpdatePermission = hasPermission(currentUser, 'UPDATE_PORTFOLIOS');

  return (
    <>
      <div className='relative overflow-x-auto p-4 space-y-4'>
        {loading && <LoadingSpinner />}
        {!loading &&
          portfolios.map((item) => (
            <CardBox hasTable key={item.id} className={'rounded'}>
              <div className={'flex items-center overflow-hidden'}>
                <ImageField
                  name={'Avatar'}
                  image={item.images}
                  className='w-24 h-24 rounded-l overflow-hidden hidden md:block'
                  imageClassName={
                    'rounded-l rounded-r-none h-full object-cover'
                  }
                />

                <div
                  className={
                    'flex-1 px-4 py-6 h-24 flex items-stretch divide-x-2 dark:divide-dark-700 overflow-x-auto'
                  }
                  onClick={() => onView(item.id)}
                >
                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>Title</p>
                    <p className={'line-clamp-2'}>{item.title}</p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>Description</p>
                    <p className={'line-clamp-2'}>{item.description}</p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>Price</p>
                    <p className={'line-clamp-2'}>{item.price}</p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>IssueNumber</p>
                    <p className={'line-clamp-2'}>{item.issue_number}</p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>Dimensions</p>
                    <p className={'line-clamp-2'}>{item.dimensions}</p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>Images</p>
                    <ImageField
                      name={'Avatar'}
                      image={item.images}
                      className='mx-auto w-8 h-8'
                    />
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>Profile</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter.profilesOneListFormatter(item.profile)}
                    </p>
                  </div>
                </div>
                <ListActionsPopover
                  onDelete={onDelete}
                  onView={onView}
                  onEdit={onEdit}
                  itemId={item.id}
                  hasUpdatePermission={hasUpdatePermission}
                />
              </div>
            </CardBox>
          ))}
        {!loading && portfolios.length === 0 && (
          <div className='col-span-full flex items-center justify-center h-40'>
            <p className=''>No data to display</p>
          </div>
        )}
      </div>
      <div className={'flex items-center justify-center my-6'}>
        <Pagination
          currentPage={currentPage}
          numPages={numPages}
          setCurrentPage={onPageChange}
        />
      </div>
    </>
  );
};

export default ListPortfolios;
