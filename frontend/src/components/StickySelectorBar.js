/**
 * StickySelectorBar. A slim bottom bar that surfaces on long service pages
 * a…4739 chars truncated…}
          data-testid="sticky-selector-dismiss"
        >
          <X size={14} />
        </button>
      </div>

      <AssessmentSelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source={source}
      />
    </>
  );
};

export default StickySelectorBar;
